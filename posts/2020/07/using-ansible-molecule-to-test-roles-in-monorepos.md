<!--
.. title: Using Ansible Molecule to test roles in monorepos
.. slug: using-ansible-molecule-to-test-roles-in-monorepos
.. date: 2020-07-12 08:03:17 UTC
.. tags: english,linux,planet-debian,software,ansible,foreman
.. category: 
.. link: 
.. description: 
.. type: text
-->

[Ansible Molecule](https://molecule.readthedocs.io) is a toolkit for testing Ansible roles. It allows for easy execution and verification of your roles and also manages the environment (container, VM, etc) in which those are executed.

In [the Foreman project](https://theforeman.org) we have a [collection of Ansible roles to setup Foreman instances called `forklift`](https://github.com/theforeman/forklift). The roles vary from configuring Libvirt and Vagrant for our CI to deploying full fledged Foreman and Katello setups with Proxies and everything. The repository also contains a dynamic Vagrant file that can generate Foreman and Katello installations on all supported Debian, Ubuntu and CentOS platforms using the previously mentioned roles. This feature is super helpful when you need to debug something specific to an OS/version combination.

Up until recently, all those roles didn't have any tests. We would run `ansible-lint` on them, but that was it.

As I am planning to do some heavier work on some of the roles to enhance our upgrade testing, I decided to add some tests first. Using Molecule, of course.

Adding Molecule to an existing role is easy: [`molecule init scenario -r my-role-name`](https://molecule.readthedocs.io/en/latest/getting-started.html#creating-a-new-role) will add all the necessary files/examples for you. It's left as an exercise to the reader how to actually test the role properly as this is not what this post is about.

Executing the tests with Molecule is also easy: [`molecule test`](https://molecule.readthedocs.io/en/latest/getting-started.html#run-a-full-test-sequence). And there are also [examples how to integrate the test execution with the common CI systems](https://molecule.readthedocs.io/en/latest/ci.html).

But what happens if you have more than one role in the repository? Molecule has [support for monorepos](https://molecule.readthedocs.io/en/latest/examples.html#monolith-repo), however that is rather limited: it will detect the role path correctly, so roles can depend on other roles from the same repository, but it won't find and execute tests for roles if you run it from the repository root. There is an [undocumented way to set `MOLECULE_GLOB`](https://github.com/ansible-community/molecule/pull/1746/files) so that Molecule would detect test scenarios in different paths, but I couldn't get it to work nicely for executing tests of multiple roles and [upstream currently does not plan to implement this](https://github.com/ansible-community/molecule/issues/1744). Well, bash to the rescue!

```bash
for roledir in roles/*/molecule; do
    pushd $(dirname $roledir)
    molecule test
    popd
done
```

Add that to your CI and be happy! The CI will execute all available tests and you can still execute those for the role you're hacking on by just calling `molecule test` as you're used to.

However, we can do even better.

When you initialize a role with Molecule or add Molecule to an existing role, there are [quite a lot of files added in the molecule directory](https://molecule.readthedocs.io/en/latest/getting-started.html#the-scenario-layout) plus an [yamllint](https://yamllint.readthedocs.io/) configuration in the role root. If you have many roles, you will notice that especially the `molecule.yml` and `.yamllint` files look very similar for each role.

It would be much nicer if we could keep those in a shared place.

Molecule supports a "base config": a configuration file that gets merged with the `molecule.yml` of your project. By default, that's `~/.config/molecule/config.yml`, but Molecule will actually look for a `.config/molecule/config.yml` in two places: the root of the VCS repository *and* your HOME. And guess what? The one in the repository wins ([that's not yet well documented](https://github.com/ansible-community/molecule/pull/2746)). So by adding a `.config/molecule/config.yml` to the repository, we can place all shared configuration there and don't have to duplicate it in every role.

And that `.yamllint` file? We can also move that to the repository root and add the following to Molecule's (now shared) configuration:

```yaml
lint: yamllint --config-file ${MOLECULE_PROJECT_DIRECTORY}/../../.yamllint --format parsable .
```

This will define the lint action as calling `yamllint` with the configuration stored in the repository root instead of the project directory, assuming you store your roles as `roles/<rolename>/` in the repository.

And that's it. We now have a central place for our Molecule and yamllint configurations and only need to place role-specific data into the role directory.
