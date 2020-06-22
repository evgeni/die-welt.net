<!--
.. title: mass-migrating modules inside an Ansible Collection
.. slug: mass-migrating-modules-inside-an-ansible-collection
.. date: 2020-06-22 19:31:05 UTC
.. tags: english,linux,planet-debian,software
.. category: 
.. link: 
.. description: 
.. type: text
-->

Im [the Foreman project](https://theforeman.org), we've been maintaining a [collection of Ansible modules to manage Foreman](https://github.com/theforeman/foreman-ansible-modules/) installations [since 2017](https://github.com/theforeman/foreman-ansible-modules/commit/37938d6c531ff5cbfffb7646fbf68f12251bf204). That is, 2 years before [Ansible had the concept of collections](https://github.com/ansible/ansible/blob/stable-2.8/changelogs/CHANGELOG-v2.8.rst#major-changes) at all.

For that you had to set `library` (and later `module_utils` and `doc_fragment_plugins`) in `ansible.cfg` and effectively inject our modules, their helpers and documentation fragments into the main Ansible namespace. Not the cleanest solution, but it worked quiet well for us.

When Ansible started introducing Collections, [we quickly joined](https://github.com/theforeman/foreman-ansible-modules/pull/279), as the idea of namespaced, easily distributable and usable content units was great and exactly matched what we had in mind.

However, collections are only usable in Ansible 2.8, or actually 2.9 as 2.8 can consume them, but tooling around building and installing them is lacking. Because of that we've been keeping our modules usable outside of a collection.

Until recently, when we decided it's time to move on, drop that compatibility (which costed a few headaches over the time) and release a shiny 1.0.0.

One of the changes we wanted for 1.0.0 is renaming a few modules. Historically we had the module names prefixed with `foreman_` and `katello_`, depending whether they were designed to work with Foreman (and plugins) or Katello (which is technically a Foreman plugin, but has a way more complicated deployment and currently can't be easily added to an existing Foreman setup). This made sense as long as we were injecting into the main Ansible namespace, but with collections the names be became `theforemam.foreman.foreman_ <something>` and while we all love Foreman, that was a bit too much. So we wanted to drop that prefix. And while at it, also change some other names (like `ptable`, which became `partition_table`) to be more readable.

But how? There is no tooling that would rename all files accordingly, adjust examples and tests. Well, `bash` to the rescue! I'm usually not a big fan of bash scripts, but renaming files, searching and replacing strings? That perfectly fits!

First of all we need a way map the old name to the new name. In most cases it's just "drop the prefix", for the others you can have some `if/elif/fi`:

```bash
prefixless_name=$(echo ${old_name}| sed -E 's/^(foreman|katello)_//')
if [[ ${old_name} == 'foreman_environment' ]]; then
  new_name='puppet_environment'
elif [[ ${old_name} == 'katello_sync' ]]; then
  new_name='repository_sync'
elif [[ ${old_name} == 'katello_upload' ]]; then
  new_name='content_upload'
elif [[ ${old_name} == 'foreman_ptable' ]]; then
  new_name='partition_table'
elif [[ ${old_name} == 'foreman_search_facts' ]]; then
  new_name='resource_info'
elif [[ ${old_name} == 'katello_manifest' ]]; then
  new_name='subscription_manifest'
elif [[ ${old_name} == 'foreman_model' ]]; then
  new_name='hardware_model'
else
  new_name=${prefixless_name}
fi
```

That defined, we need to actually have a `${old_name}`. Well, that's a `for` loop over the modules, right?

```bash
for module in ${BASE}/foreman_*py ${BASE}/katello_*py; do
  old_name=$(basename ${module} .py)
  …
done
```

While we're looping over files, let's rename them and all the files that are associated with the module:

```bash
# rename the module
git mv ${BASE}/${old_name}.py ${BASE}/${new_name}.py

# rename the tests and test fixtures
git mv ${TESTS}/${old_name}.yml ${TESTS}/${new_name}.yml
git mv tests/fixtures/apidoc/${old_name}.json tests/fixtures/apidoc/${new_name}.json
for testfile in ${TESTS}/fixtures/${old_name}-*.yml; do
  git mv ${testfile} $(echo ${testfile}| sed "s/${old_name}/${new_name}/")
done
```

Now comes the really tricky part: search and replace. Let's see where we need to replace first:

1. in the module file
    1. `module` key of the `DOCUMENTATION` stanza (e.g. `module: foreman_example`)
    2. all examples (e.g. `foreman_example: …`)
2. in all test playbooks (e.g. `foreman_example: …`)
3. in pytest's `conftest.py` and other files related to test execution
4. in documentation

```bash
sed -E -i "/^(\s+${old_name}|module):/ s/${old_name}/${new_name}/g" ${BASE}/*.py

sed -E -i "/^(\s+${old_name}|module):/ s/${old_name}/${new_name}/g" tests/test_playbooks/tasks/*.yml tests/test_playbooks/*.yml

sed -E -i "/'${old_name}'/ s/${old_name}/${new_name}/" tests/conftest.py tests/test_crud.py

sed -E -i "/`${old_name}`/ s/${old_name}/${new_name}/g' README.md docs/*.md
```

You've probably noticed I used `${BASE}` and `${TESTS}` and never defined them… Lazy me.

But here is the full script, defining the variables and looping over all the modules.

```bash
#!/bin/bash

BASE=plugins/modules
TESTS=tests/test_playbooks
RUNTIME=meta/runtime.yml

echo "plugin_routing:" > ${RUNTIME}
echo "  modules:" >> ${RUNTIME}

for module in ${BASE}/foreman_*py ${BASE}/katello_*py; do
  old_name=$(basename ${module} .py)
  prefixless_name=$(echo ${old_name}| sed -E 's/^(foreman|katello)_//')
  if [[ ${old_name} == 'foreman_environment' ]]; then
    new_name='puppet_environment'
  elif [[ ${old_name} == 'katello_sync' ]]; then
    new_name='repository_sync'
  elif [[ ${old_name} == 'katello_upload' ]]; then
    new_name='content_upload'
  elif [[ ${old_name} == 'foreman_ptable' ]]; then
    new_name='partition_table'
  elif [[ ${old_name} == 'foreman_search_facts' ]]; then
    new_name='resource_info'
  elif [[ ${old_name} == 'katello_manifest' ]]; then
    new_name='subscription_manifest'
  elif [[ ${old_name} == 'foreman_model' ]]; then
    new_name='hardware_model'
  else
    new_name=${prefixless_name}
  fi
  
  echo "renaming ${old_name} to ${new_name}"
  
  git mv ${BASE}/${old_name}.py ${BASE}/${new_name}.py

  git mv ${TESTS}/${old_name}.yml ${TESTS}/${new_name}.yml
  git mv tests/fixtures/apidoc/${old_name}.json tests/fixtures/apidoc/${new_name}.json
  for testfile in ${TESTS}/fixtures/${old_name}-*.yml; do
    git mv ${testfile} $(echo ${testfile}| sed "s/${old_name}/${new_name}/")
  done
  
  sed -E -i "/^(\s+${old_name}|module):/ s/${old_name}/${new_name}/g" ${BASE}/*.py

  sed -E -i "/^(\s+${old_name}|module):/ s/${old_name}/${new_name}/g" tests/test_playbooks/tasks/*.yml tests/test_playbooks/*.yml
  
  sed -E -i "/'${old_name}'/ s/${old_name}/${new_name}/" tests/conftest.py tests/test_crud.py
  
  sed -E -i "/`${old_name}`/ s/${old_name}/${new_name}/g' README.md docs/*.md

  echo "    ${old_name}:" >> ${RUNTIME}
  echo "      redirect: ${new_name}" >> ${RUNTIME}

  git commit -m "rename ${old_name} to ${new_name}" ${BASE} tests/ README.md docs/ ${RUNTIME}
done
```

As a bonus, the script will also generate a `meta/runtime.yml` which can be used by [Ansible 2.10+ to automatically use the new module names if the playbook contains the old ones](https://github.com/ansible/ansible/pull/67684).

Oh, and yes, this is probably not the nicest script you'll read this year. Maybe not even today. But it got the job nicely done and I don't intend to need it again anyways.
