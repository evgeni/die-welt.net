<!--
.. title: Using Packit to build RPMs for projects that depend on or vendor your code
.. slug: using-packit-to-build-rpms-for-projects-that-depend-on-or-vendor-your-code
.. date: 2024-05-14 20:12:02 UTC
.. tags: english,linux,software,planet-debian
.. category: 
.. link: 
.. description: 
.. type: text
-->

I am a huge fan of [Packit](https://packit.dev/) as it allows [us](https://theforeman.org/) to provide RPMs to our users and testers directly from a pull-request,
thus massively tightening the feedback loop and involving people who otherwise might not be able to apply the changes (for whatever reason) and "quickly test" something out.
It's also a great way to validate that a change actually builds in a production environment, where no unnecessary development and test dependencies are installed.

You can also run tests of the built packages on [Testing Farm](https://docs.testing-farm.io/) and automate pushing releases into Fedora/CentOS Stream,
but this is neither a (plain) Packit advertisement post, nor is that functionality that I can talk about with a certain level of experience.

[Adam](https://github.com/adamruzicka) recently asked why we don't have Packit builds for our our Puppet modules
and my first answer was: "well, puppet-* doesn't produce a thing we ship directly, so nobody dared to do it".

My second answer was that I had [blogged how to test a Puppet module PR with Packit](https://theforeman.org/2023/11/testing-a-foreman-installer-patch-with-packit-and-forklift.html),
but I totally agree that the process was a tad cumbersome and could be improved.

Now some madman did it and we all get to hear his story! ;-)

## What is the problem anyway?

The [Foreman Installer](https://github.com/theforeman/foreman-installer) is a bit of Ruby code[^1] that provides a CLI to `puppet apply` based on a set of Puppet modules.
As the Puppet modules can also be used outside the installer and have their own lifecycle, they live in separate git repositories and their releases get uploaded to the [Puppet Forge](https://forge.puppet.com/).
Users however do not want to (and should not have to) install the modules themselves.

So we have to ship the modules inside the `foreman-installer` package.
Packaging 25 modules for two packaging systems (we support Enterprise Linux and Debian/Ubuntu) seems like a lot of work.
Especially if you consider that the main `foreman-installer` package would need to be rebuilt after each module change as it contains generated files based on the modules which are too expensive to generate at runtime.

So we can ship the modules inside the `foreman-installer` source release, thus vendoring those modules into the installer release.

To do so [we use](https://github.com/theforeman/foreman-installer/blob/df6fa10a018ad255a6f669db9a6893468882abba/Rakefile#L300-L314) [`librarian-puppet`](https://github.com/voxpupuli/librarian-puppet) with a [`Puppetfile`](https://github.com/theforeman/foreman-installer/blob/develop/Puppetfile) and either a `Puppetfile.lock` for stable releases or by letting `librarian-puppet` fetch latest for nightly snapshots.

This works beautifully for changes that land in the development and release branches of our repositories - regardless if it's `foreman-installer.git` or any of the `puppet-*.git` ones.
It also works nicely for [pull-requests against `foreman-installer.git`](https://github.com/theforeman/foreman-installer/blob/develop/.packit.yaml).

But because the `puppet-*` repositories do not map to packages, we assumed it wouldn't work well for pull-requests against those.

[^1]: [three](https://github.com/theforeman/kafo) [Ruby](https://github.com/theforeman/kafo_parsers) [modules](https://github.com/theforeman/kafo_wizards) in a trench coat, so to say

## How can we solve this?

Well, the "obvious" solution is to build the `foreman-installer` package via Packit also for pull-requests against the `puppet-*` repositories.
However, as usual, the devil is in the details.

Packit by default clones the repository of the pull-request and tries to create a source tarball from that using `git archive`.
As this might be too simple for many projects, one can define a custom [`create-archive`](https://packit.dev/docs/configuration/actions#create-archive) action that runs after the pull-request has been cloned and produces the tarball instead.
We already use that in the Packit configuration for `foreman-installer` to run the `pkg:generate_source` rake target which executes `librarian-puppet` for us.

But now the pull-request is against one of the Puppet modules, so Packit will clone that, not the installer.

We gotta clone `foreman-installer` on our own.
And then point `librarian-puppet` at the pull-request.
Fun.

Cloning is relatively simple, call `git clone` -- sorry Packit/Copr infrastructure.

But the Puppet module pull-request?
One can use `:git => 'https://git.example.com/repo.git'` in the `Puppetfile` to fetch a git repository.
In fact, that's what we already do for our nightly snapshots.
It also supports `:ref => 'some_branch_or_tag_name'`, if the remote `HEAD` is not what you want.

My brain first went "I know this! GitHub has this magic `refs/pull/1/head` and `refs/pull/1/merge` refs you can checkout to get the contents of the pull-request without bothering to add a remote for the source of the pull-request".
Well, this requires to know the ID of the pull-request and Packit does not expose that in the [environment variables available during `create-archive`](https://packit.dev/docs/configuration/actions#environment-variables-set-by-packit).

Wait, but we already have a checkout.
Can we just say `:git => '../.git'`?
Cloning a `.git` folder is totally possible after all.

```
[Librarian]     --> fatal: repository '../.git' does not exist
Could not checkout ../.git: fatal: repository '../.git' does not exist
```

Seems `librarian` disagrees.
Damn.
(Yes, I checked, the path exists.)

💡 does it maybe just not like relative paths?!
Yepp, using an absolute path absolutely works!

For some reason it ends up checking out the default `HEAD` of the "real" (GitHub) remote, not of `../`.
Luckily this can be fixed by explicitly passing `:ref => 'origin/HEAD'`, which resolves to the branch Packit created for the pull-request.

Now we just need to put all of that together and remember to execute all commands from inside the `foreman-installer` checkout as that is where all our vendoring recipes etc live.

## Putting it all together

Let's look at the diff between the `packit.yaml` for `foreman-installer` and the one I've [proposed for `puppet-pulpcore`](https://github.com/theforeman/puppet-pulpcore/pull/341):

```diff
--- a/foreman-installer/.packit.yaml	2024-05-14 21:45:26.545260798 +0200
+++ b/puppet-pulpcore/.packit.yaml	2024-05-14 21:44:47.834162418 +0200
@@ -18,13 +18,15 @@
 actions:
   post-upstream-clone:
     - "wget https://raw.githubusercontent.com/theforeman/foreman-packaging/rpm/develop/packages/foreman/foreman-installer/foreman-installer.spec -O foreman-installer.spec"
+    - "git clone https://github.com/theforeman/foreman-installer"
+    - "sed -i '/theforeman.pulpcore/ s@:git.*@:git => \"#{__dir__}/../.git\", :ref => \"origin/HEAD\"@' foreman-installer/Puppetfile"
   get-current-version:
-    - "sed 's/-develop//' VERSION"
+    - "sed 's/-develop//' foreman-installer/VERSION"
   create-archive:
-    - bundle config set --local path vendor/bundle
-    - bundle config set --local without development:test
-    - bundle install
-    - bundle exec rake pkg:generate_source
+    - bash -c "cd foreman-installer && bundle config set --local path vendor/bundle"
+    - bash -c "cd foreman-installer && bundle config set --local without development:test"
+    - bash -c "cd foreman-installer && bundle install"
+    - bash -c "cd foreman-installer && bundle exec rake pkg:generate_source"
```

1. It clones `foreman-installer` (in `post-upstream-clone`, as that felt more natural after some thinking)
1. It adjusts the `Puppetfile` to use `#{__dir__}/../.git` as the Git repository, abusing the fact that a `Puppetfile` is really just a Ruby script (sorry Ben!) and knows the `__dir__` it lives in
1. It fetches the version from the `foreman-installer` checkout, so it's sort-of reasonable
1. It performs all building inside the `foreman-installer` checkout

## Can this be used in other scenarios?

I hope so!
Vendoring is not unheard of.
And testing your "consumers" (dependents? naming is hard) is good style anyway!
