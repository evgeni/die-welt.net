<!--
.. title: Building documentation for Ansible Collections using antsibull
.. slug: building-documentation-for-ansible-collections-using-antsibull
.. date: 2020-07-24 08:01:10 UTC
.. tags: english,linux,planet-debian,software,ansible,foreman
.. category: 
.. link: 
.. description: 
.. type: text
-->

In my recent post about [building and publishing documentation for Ansible Collections](/2020/07/building-and-publishing-documentation-for-ansible-collections/), I've mentioned that the Ansible Community is currently in the process of making their build tools available as a separate project called [antsibull](https://github.com/ansible-community/antsibull) instead of keeping them in the `hacking` directory of `ansible.git`.

I've also said that I couldn't get the documentation to build with `antsibull-docs` as it [wouldn't support collections yet](https://github.com/ansible-community/antsibull/issues/55). Thankfully, [Felix Fontein](https://github.com/felixfontein), one of the maintainers of antsibull, [pointed out that I was wrong and later versions of antsibull actually have partial collections support](https://github.com/ansible/community/issues/546#issuecomment-661307831). So I went ahead and tried it again.

And what should I say? Two [bug](https://github.com/ansible-community/antsibull/issues/140) [reports](https://github.com/ansible-community/antsibull/issues/141) by me and four [patches](https://github.com/ansible-community/antsibull/pull/142) [by](https://github.com/ansible-community/antsibull/pull/144) [Felix](https://github.com/ansible-community/antsibull/pull/145) [Fontain](https://github.com/ansible-community/antsibull/pull/146) later I can [use `antsibull-docs` to generate the Foreman Ansible Modules documentation](https://github.com/theforeman/foreman-ansible-modules/pull/895)!

Let's see what's needed instead of the ugly hack in detail.

We obviously don't need to clone `ansible.git` anymore and install its requirements manually. Instead we can just install `antsibull` (0.17.0 contains all the above patches). We also need Ansible (or `ansible-base`) 2.10 or never, which currently only exists as a pre-release. 2.10 is the first version that has an `ansible-doc` that can *list* contents of a collection, which `antsibull-docs` requires to work properly.

The current implementation of collections documentation in `antsibull-docs` requires the collection to be *installed* as in "Ansible can find it". We had the same requirement before to find the documentation fragments and can just re-use the installation we do for various other build tasks in `build/collection` and point at it using the `ANSIBLE_COLLECTIONS_PATHS` environment variable or the `collections_paths` setting in `ansible.cfg`[^paths_deprecated]. After that, it's only a matter of passing `--use-current` to make it pick up installed collections instead of trying to fetch and parse them itself.

Given the main goal of `antisibull-docs collection` is to build documentation for *multiple* collections at once, it defaults to place the generated files into `<dest-dir>/collections/<namespace>/<collection>`. However, we only build documentation for one collection and thus pass `--squash-hierarchy` to avoid this longish path and make it generate documentation directly in `<dest-dir>`. Thanks to Felix for implementing this feature for us!

And that's it! We can generate our documentation with a single line now!

```bash
antsibull-docs collection --use-current --squash-hierarchy --dest-dir ./build/plugin_docs theforeman.foreman
```

The [PR to switch to antsibull is open for review](https://github.com/theforeman/foreman-ansible-modules/pull/895) and I hope to get merged in soon!

Oh and you know what's cool? The [documentation is now also available as a preview on ansible.com](https://docs.ansible.com/ansible/2.10/collections/theforeman/foreman/index.html)!

[^paths_deprecated]: Yes, the path**s** version of that setting is deprecated in 2.10, but as we support older Ansible versions, we still use it.
