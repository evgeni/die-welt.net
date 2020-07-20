<!--
.. title: Building and publishing documentation for Ansible Collections
.. slug: building-and-publishing-documentation-for-ansible-collections
.. date: 2020-07-20 19:17:16 UTC
.. tags: english,linux,planet-debian,software,ansible
.. category: 
.. link: 
.. description: 
.. type: text
-->

I had a draft of this article for about two months, but never really managed to polish and finalize it, partially due to some nasty hacks needed down the road. Thankfully, one of my wishes was heard and I had now the chance to revisit the post and try a few things out. Sadly, my wish was granted only partially and the result is still not beautiful, but read yourself ;-)

As part of my day job, I am maintaining the [Foreman Ansible Modules](https://github.com/theforeman/foreman-ansible-modules) - a collection of modules to interact with Foreman and its plugins (most notably Katello). We've been maintaining this collection (as in set of modules) since 2017, so much longer than collections (as in Ansible Collections) existed, but the introduction of Ansible Collections allowed us to provide a much easier and supported way to distribute the modules to our users.

Now users usually want to things: features and documentation. Features are easy, we already have plenty of them. But documentation was a bit cumbersome: we had documentation inside the modules, so you could read it via `ansible-doc` on the command line if you had the collection installed, but we wanted to provide online readable and versioned documentation too - something the users are used to from the official Ansible documentation.

## Building HTML from Ansible modules

Ansible modules contain [documentation in form of YAML blocks documenting the parameters, examples and return values](https://docs.ansible.com/ansible/latest/dev_guide/developing_modules_documenting.html) of the module. The Ansible documentation site is built using [Sphinx](https://www.sphinx-doc.org/) from reStructuredText. As the modules don't contain reStructuredText, Ansible ~~has~~had a tool to generate it from the documentation YAML: [`build-ansible.py document-plugins`](https://github.com/ansible/ansible/blob/stable-2.9/hacking/build-ansible.py). The tool and the accompanying libraries are not part of the Ansible distribution - they just live in the `hacking` directory. To run them we need a git checkout of Ansible and source `hacking/env-setup` to set `PYTHONPATH` and a few other variables correctly for Ansible to run directly from that checkout.

~~It would be nice if that'd be a feature of `ansible-doc`, but while it isn't, we need to have a full Ansible git checkout to be able to continue.~~The tool has been recently split out into an own repository/distribution: [`antsibull`](https://github.com/ansible-community/antsibull). However it was also a bit redesigned to be easier to use (good!), and my hack to abuse it to build documentation for out-of-tree modules doesn't work anymore (bad!). There is an [issue open for collections support](https://github.com/ansible-community/antsibull/issues/55), so I hope to be able to switch to `antsibull` soon.

Anyways, back to the original hack.

As we're using documentation fragments, we need to tell the tool to look for these, because otherwise we'd get errors about not found fragments.
We're passing `ANSIBLE_COLLECTIONS_PATHS` so that the tool can find the correct, namespaced documentation fragments there.
We also need to provide `--module-dir` pointing at the actual modules we want to build documentation for.

```bash
ANSIBLEGIT=/path/to/ansible.git
source ${ANSIBLEGIT}/hacking/env-setup
ANSIBLE_COLLECTIONS_PATHS=../build/collections python3 ${ANSIBLEGIT}/hacking/build-ansible.py document-plugins --module-dir ../plugins/modules --template-dir ./_templates --template-dir ${ANSIBLEGIT}/docs/templates --type rst --output-dir ./modules/
```

Ideally, when `antsibull` supports collections, this will become `antsibull-docs collection …` without any need to have an Ansible checkout, sourcing `env-setup` or pass tons of paths.

Until then we have a [`Makefile`](https://www.github.com/theforeman/foreman-ansible-modules/tree/master/docs/Makefile) that clones Ansible, runs the above command and then calls Sphinx (which provides a nice `Makefile` for building) to generate HTML from the reStructuredText.

You can find our slightly modified templates and themes in our [git repository in the `docs` directory](https://github.com/theforeman/foreman-ansible-modules/tree/master/docs).

## Publishing HTML documentation for Ansible  Modules

Now that we have a way to build the documentation, let's also automate publishing, because nothing is worse than out-of-date documentation!

We're using GitHub and GitHub Actions for that, but you can achieve the same with GitLab, TravisCI or Jenkins.

First, we need a trigger. As we want always up-to-date documentation for the main branch where all the development happens and also documentation for all stable releases that are tagged (we use `vX.Y.Z` for the tags), we can do something like this:

```yaml
on:
  push:
    tags:
      - v[0-9]+.[0-9]+.[0-9]+
    branches:
      - master
```

Now that we have a trigger, we define the job steps that get executed:

```yaml
    steps:
      - name: Check out the code
        uses: actions/checkout@v2
      - name: Set up Python
        uses: actions/setup-python@v2
        with:
          python-version: "3.7"
      - name: Install dependencies
        run: make doc-setup
      - name: Build docs
        run: make doc
```

At this point we will have the docs built by `make doc` in the `docs/_build/html` directory, but not published anywhere yet.

As we're using GitHub anyways, we can also use GitHub Pages to host the result.

```yaml
      - uses: actions/checkout@v2
      - name: configure git
        run: |
          git config user.name "${GITHUB_ACTOR}"
          git config user.email "${GITHUB_ACTOR}@bots.github.com"
          git fetch --no-tags --prune --depth=1 origin +refs/heads/*:refs/remotes/origin/*
      - name: Set up Python
        uses: actions/setup-python@v2
        with:
          python-version: "3.7"
      - name: Install dependencies
        run: make doc-setup
      - name: Build docs
        run: make doc
      - name: commit docs
        run: |
          git checkout gh-pages
          rm -rf $(basename ${GITHUB_REF})
          mv docs/_build/html $(basename ${GITHUB_REF})
          dirname */index.html | sort --version-sort | xargs -I@@ -n1 echo '<div><a href="@@/"><p>@@</p></a></div>' >> index.html
          git add $(basename ${GITHUB_REF}) index.html
          git commit -m "update docs for $(basename ${GITHUB_REF})" || true
      - name: push docs
        run: git push origin gh-pages
```

As this is not exactly self explanatory:

1. Configure git to have a proper author name and email, as otherwise you get ugly history and maybe even failing commits
2. Fetch all branch names, as the checkout action by default doesn't do this.
3. Setup Python, Sphinx, Ansible etc.
4. Build the documentation as described above.
5. Switch to the `gh-pages` branch from the commit that triggered the workflow.
6. Remove any existing documentation for this tag/branch (`$GITHUB_REF` contains the name which triggered the workflow) if it exists already.
7. Move the previously built documentation from the Sphinx output directory to a directory named after the current target.
8. Generate a simple index of all available documentation versions.
9. Commit all changes, but don't fail if there is nothing to commit.
10. Push to the `gh-pages` branch which will trigger a GitHub Pages deployment.

Pretty sure this won't win any beauty contest for scripting and automation, but it gets the job done and nobody on the team has to remember to update the documentation anymore.

You can see the results on [theforeman.org](https://theforeman.org/plugins/foreman-ansible-modules/) or directly on [GitHub](https://theforeman.github.io/foreman-ansible-modules/).
