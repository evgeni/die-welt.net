<!--
.. title: Arguing with an AI or how Evgeni tried to use CodeRabbit
.. slug: arguing-with-an-ai-or-how-evgeni-tried-to-use-coderabbit
.. date: 2025-06-17 15:19:57 UTC
.. tags: english,linux,planet-debian,software
.. category: 
.. link: 
.. description: 
.. type: text
-->

Everybody is trying out AI assistants these days, so I figured I'd jump on that train and see how fast it derails.

I went with [CodeRabbit](https://www.coderabbit.ai/) because I've seen it on YouTube — ads work, I guess.

I am trying to answer the following questions:

- Did the AI find things that humans did not find (or didn't bother to mention)
- Did the AI output help the humans with the review (useful summary etc)
- Did the AI output help the humans with the code (useful suggestions etc)
- Was the AI output misleading?
- Was the AI output distracting?

To reduce the amount of output and not to confuse contributors, CodeRabbit was configured to only do reviews on demand.

What follows is a rather unscientific evaluation of CodeRabbit based on PRs in two Foreman-related repositories,
looking at the summaries CodeRabbit posted as well as the comments/suggestions it had about the code.

# Ansible 2.19 support

PR: [theforeman/foreman-ansible-modules#1848](https://github.com/theforeman/foreman-ansible-modules/pull/1848)

## summary posted

The summary CodeRabbit posted is *technically* correct.

> This update introduces several changes across CI configuration, Ansible roles, plugins, and test playbooks. It expands CI test coverage to a new Ansible version, adjusts YAML key types in test variables, refines conditional logic in Ansible tasks, adds new default variables, and improves clarity and consistency in playbook task definitions and debug output.

Yeah, it does all of that, all right.
But it kinda misses the point that the addition here is "Ansible 2.19 support", which starts with adding it to the CI matrix and then adjusting the code to actually work with that version.
Also, the changes are not for "clarity" or "consistency", they are fixing bugs in the code that the older Ansible versions accepted, but the new one is more strict about.

Then it adds a table with the changed files and what changed in there.
To me, as the author, it felt redundant, and IMHO doesn't add any clarity to understand the changes.
(And yes, same "clarity" vs bugfix mistake here, but that makes sense as it apparently miss-identified the change reason)

And then the sequence diagrams…
They probably help if you have a dedicated change to a library or a library consumer,
but for this PR it's just noise, especially as it only covers two of the changes (addition of 2.19 to the test matrix and a change to the inventory plugin), completely ignoring other important parts.

Overall verdict: noise, don't need this.

## comments posted

CodeRabbit also posted 4 comments/suggestions to the changes.

### Guard against undefined `result.task`

IMHO a valid suggestion, even if on the picky side as I am not sure how to make it undefined here.
I ended up implementing it, even if with slightly different (and IMHO better readable) syntax.

- Valid complaint? Probably.
- Useful suggestion? So-So.
- Wasted time? No.

### Inconsistent pipeline in `when` for composite CV versions

That one was funny! The original complaint was that the `when` condition used slightly different data manipulation than the data that was passed when the condition was `true`.
The code was supposed to do "clean up the data, but only if there are any items left after removing the first 5, as we always want to keep 5 items".

And I do agree with the analysis that it's badly maintainable code.
But the suggested fix was to re-use the data in the variable we later use for performing the cleanup.
While this is (to my surprise!) valid Ansible syntax, it didn't make the code much more readable as you need to go and look at the variable definition.

The better suggestion then came from Ewoud: to compare the length of the data with the number we want to keep.
Humans, so smart!

But Ansible is not Ewoud's native turf, so he asked whether there is a more elegant way to count how much data we have than to use `| list | count` in Jinja (the data comes from a Python generator, so needs to be converted to a `list` first).

And the AI helpfully suggested to use `| count` instead!

However, `count` is just an alias for `length` in Jinja, so it behaves identically and needs a `list`.

Luckily the AI quickly apologized for being wrong after being pointed at the Jinja source and didn't try to waste my time any further.
Wouldn't I have known about the `count` alias, we'd have committed that suggestion and let CI fail before reverting again.

- Valid complaint? Yes.
- Useful suggestion? Nope.
- Wasted time? Yes.

### Apply the same fix for non-composite CV versions

The very same complaint was posted a few lines later, as the logic there is very similar — just slightly different data to be filtered and cleaned up.

Interestingly, here the suggestion also was to use the variable.
But there is no variable with the data!

The text actually says one need to "define" it, yet the "committable suggestion" doesn't contain that part.

Interestingly, when asked where it sees the "inconsistency" in that hunk, it said the inconsistency is with the composite case above.
That however is nonsense, as while we want to keep the same number of composite and non-composite CV versions,
the data used in the task is different — it even gets consumed by a totally different playbook — so there can't be any real consistency between the branches.

- Valid complaint? Yes (the expression really could use some cleanup).
- Useful suggestion? Nope.
- Wasted time? Yes.

I ended up applying the same logic as suggested by Ewoud above.
As *that* refactoring was possible in a consistent way.

### Ensure consistent naming for Oracle Linux subscription defaults

One of the changes in Ansible 2.19 is that Ansible fails when there are undefined variables, even if they are only undefined for cases where they are unused.

CodeRabbit complains that the names of the defaults I added are inconsistent.
And that is technically correct.
But those names are already used in other places in the code, so I'd have to refactor more to make it work properly.

Once being pointed at the fact that the variables already exist,
the AI is as usual quick to apologize, yay.

- Valid complaint? Technically, yes.
- Useful suggestion? Nope.
- Wasted time? Yes.

# add new parameters to the repository module

PR: [theforeman/foreman-ansible-modules#1860](https://github.com/theforeman/foreman-ansible-modules/pull/1860)

## summary posted

Again, the summary is *technically* correct

> The repository module was updated to support additional parameters for repository synchronization and authentication. New options were added for ansible collections, ostree, Python packages, and yum repositories, including authentication tokens, filtering controls, and version retention settings. All changes were limited to module documentation and argument specification.

But it doesn't add anything you'd not get from looking at the diff, especially as it contains a large documentation chunk explaining those parameters.

No sequence diagram this time.
That's a good thing!

Overall verdict: noise (even if the amount is small), don't need this.

## comments posted

CodeRabbit generated two comments for this PR.

Interestingly, none of them overlapped with the issues `ansible-lint` and friends found.

### get rid of the FIXMEs

Yepp, that's fair

- Valid complaint? Yes.
- Useful suggestion? Nope. (But it's not possible in this case!)
- Wasted time? No.

### add validation for the new parameters

Yepp, I forgot these (not intentionally!).

The diff it suggests is nonsense, as it doesn't take into account the existing Ansible and Yum validations, but it clearly has read them as the style etc of the new ones matches.
It also managed to group the parameters correctly by repository type, so it's something.

```patch
 if module.foreman_params['content_type'] != 'ansible_collection':
     invalid_list = [key for key in ['ansible_collection_requirements'] if key in module.foreman_params]
     if invalid_list:
         module.fail_json(msg="({0}) can only be used with content_type 'ansible_collection'".format(",".join(invalid_list)))
+
+# Validate ansible_collection specific parameters
+if module.foreman_params['content_type'] != 'ansible_collection':
+    invalid_list = [key for key in ['ansible_collection_auth_token', 'ansible_collection_auth_url'] if key in module.foreman_params]
+    if invalid_list:
+        module.fail_json(msg="({0}) can only be used with content_type 'ansible_collection'".format(",".join(invalid_list)))
+
+# Validate ostree specific parameters
+if module.foreman_params['content_type'] != 'ostree':
+    invalid_list = [key for key in ['depth', 'exclude_refs', 'include_refs'] if key in module.foreman_params]
+    if invalid_list:
+        module.fail_json(msg="({0}) can only be used with content_type 'ostree'".format(",".join(invalid_list)))
+
+# Validate python package specific parameters
+if module.foreman_params['content_type'] != 'python':
+    invalid_list = [key for key in ['excludes', 'includes', 'package_types', 'keep_latest_packages'] if key in module.foreman_params]
+    if invalid_list:
+        module.fail_json(msg="({0}) can only be used with content_type 'python'".format(",".join(invalid_list)))
+
+# Validate yum specific parameter
+if module.foreman_params['content_type'] != 'yum' and 'upstream_authentication_token' in module.foreman_params:
+    module.fail_json(msg="upstream_authentication_token can only be used with content_type 'yum'")
```

Interestingly, it also said "Note: If 'python' is not a valid content_type, please adjust the validation accordingly." which is quite a hint at a bug in itself.
The module currently does not even allow to create `content_type=python` repositories.
That should have been more prominent, as it's a **BUG**!

- Valid complaint? Yes.
- Useful suggestion? Mostly (I only had to merge the Yum and Ansible branches with the existing code).
- Wasted time? Nope.

# parameter persistence in obsah

PR: [theforeman/obsah#72](https://github.com/theforeman/obsah/pull/72)

## summary posted

Mostly correct.

It did miss-interpret the change to a test playbook as an actual "behavior" change:
"Introduced new playbook variables for database configuration" — there is no database configuration in this repository, just the test playbook using the same metadata as a consumer of the library.
Later on it does say "Playbook metadata and test fixtures", so… unclear whether this is a miss-interpretation or just badly summarized.
As long as you also look at the diff, it won't confuse you, but if you're using the summary as the sole source of information (bad!) it would.

This time the sequence diagram is actually useful, yay.
Again, not 100% accurate: it's missing the fact that saving the parameters is hidden behind an "if enabled" flag — something it did represent correctly for loading them.

Overall verdict: not really useful, don't need this.

## comments posted

Here I was a bit surprised, especially as the nitpicks were useful!

### Persist-path should respect per-user state locations (nitpick)

My original code used `os.environ.get('OBSAH_PERSIST_PATH', '/var/lib/obsah/parameters.yaml')` for the location of the persistence file.
CodeRabbit correctly pointed out that this won't work for non-root users and one should respect `XDG_STATE_HOME`.

Ewoud did point that out in his own review, so I am not sure whether CodeRabbit came up with this on its own, or also took the human comments into account.

The suggested code seems fine too — just doesn't use `/var/lib/obsah` at all anymore.
This might be a good idea for the generic library we're working on here, and then be overridden to a static `/var/lib` path in a consumer (which always runs as root).

In the end I did not implement it, but mostly because I was lazy and was sure we'd override it anyway.

- Valid complaint? Yes.
- Useful suggestion? Yes.
- Wasted time? Nope.

### Positional parameters are silently excluded from persistence (nitpick)

The library allows you to generate both positional (`foo` without `--`) and non-positional (`--foo`) parameters, but the code I wrote would only ever persist non-positional parameters.
This was intentional, but there is no documentation of the intent in a comment — which the rabbit thought would be worth pointing out.

It's a fair nitpick and I ended up adding a comment.

- Valid complaint? Yes.
- Useful suggestion? Yes.
- Wasted time? Nope.

### Enforce FQDN validation for `database_host`

The library has a way to perform type checking on passed parameters, and one of the supported types is "FQDN" — so a fully qualified domain name, with dots and stuff.
The test playbook I added has a `database_host` variable, but I didn't bother adding a type to it, as I don't really need any type checking here.

While using "FQDN" might be a bit too strict here — technically a working database connection can also use a non-qualified name or an IP address, I was positively surprised by this suggestion.
It shows that the rest of the repository was taken into context when preparing the suggestion.

- Valid complaint? In the context of a test, no. Would that be a real command definition, yes.
- Useful suggestion? Yes.
- Wasted time? Nope.

### `reset_args()` can raise `AttributeError` when a key is absent

This is a correct finding, the code is not written in a way that would survive if it tries to reset things that are not set.
However, that's only true for the case where users pass in `--reset-<parameter>` without ever having set `parameter` before.
The complaint about the part where the parameter is part of the persisted set but not in the parsed args is wrong — as parsed args inherit from the persisted set.

The suggested code is not well readable, so I ended up fixing it slightly differently.

- Valid complaint? Mostly.
- Useful suggestion? Meh.
- Wasted time? A bit.

### Persisted values bypass `argparse` type validation

When persisting, I just `yaml.safe_dump` the parsed parameters, which means the YAML will contain native types like integers.

The `argparse` documentation warns that the type checking `argparse` does only applies to strings and is skipped if you pass anything else (via default values).

While correct, it doesn't really hurt here as the persisting only happens after the values were type-checked.
So there is not really a reason to type-check them again.
Well, unless the type changes, anyway.

Not sure what I'll do with this comment.

- Valid complaint? Nah.
- Useful suggestion? Nope.
- Wasted time? Not much.

### consider using `contextlib.suppress`

This was added when I asked CodeRabbit for a re-review after pushing some changes.
Interestingly, the PR already contained `try: … except: pass` code before, and it did not flag that.

Also, the code suggestion contained `import contextlib` in the middle of the code, instead in the head of the file.
Who would do that?!

But the comment as such was valid, so I fixed it in all places it is applicable, not only the one the rabbit found.

- Valid complaint? Yes.
- Useful suggestion? Nope.
- Wasted time? Nope.

# workaround to ensure LCE and CV are always sent together

PR: [theforeman/foreman-ansible-modules#1867](https://github.com/theforeman/foreman-ansible-modules/pull/1867)

## summary posted

> A workaround was added to the _update_entity method in the ForemanAnsibleModule class to ensure that when updating a host, both content_view_id and lifecycle_environment_id are always included together in the update payload. This prevents partial updates that could cause inconsistencies.

Partial updates are not a thing.

The workaround is purely for the fact that Katello expects both parameters to be sent,
even if only one of them needs an actual update.

No diagram, good.

Overall verdict: misleading summaries are bad!

## comments posted

Given a small patch, there was only one comment.

### Implementation looks correct, but consider adding error handling for robustness.

This reads correct on the first glance.
More error handling is always better, right?

But if you dig into the argumentation, you see it's wrong.
Either:

- we're working with a Katello setup and the host we're updating has content, so CV and LCE will be present
- we're working with a Katello setup and the host has no content (yet), so CV and LCE will be "updated" and we're not running into the workaround
- we're working with a plain Foreman, then both parameters are not even accepted by Ansible

The AI accepted defeat once I asked it to analyze things in more detail, but why did I have to ask in the first place?!

- Valid complaint? Nope.
- Useful suggestion? Nope.
- Wasted time? Yes, as I've actually tried to come up with a case where it can happen.

# Summary

Well, idk, really.

## Did the AI find things that humans did not find (or didn't bother to mention)?

Yes. It's debatable whether these were useful (see e.g. the `database_host` example), but I tend to be in the "better to nitpick/suggest more and dismiss than oversee" team, so IMHO a positive win.

## Did the AI output help the humans with the review (useful summary etc)?

In my opinion it did not.
The summaries were either "lots of words, no real value" or plain wrong.
The sequence diagrams were not useful either.

Luckily all of that can be turned off in the settings, which is what I'd do if I'd continue using it.

## Did the AI output help the humans with the code (useful suggestions etc)?

While the actual patches it posted were "meh" at best, there were useful findings that resulted in improvements to the code.

## Was the AI output misleading?

Absolutely! The whole Jinja discussion would have been easier without the AI "help".
Same applies for the "error handling" in the workaround PR.

## Was the AI output distracting?

The output is certainly a lot, so yes I think it can be distracting.
As mentioned, I think dropping the summaries can make the experience less distracting.

## What does all that mean?

I will disable the summaries for the repositories, but will leave the `@coderabbitai review` trigger active if someone wants an AI-assisted review.
This won't be something that I'll force on our contributors and maintainers, but they surely can use it if they want.

But I don't think I'll be using this myself on a regular basis.

Yes, it can be made "usable". But so can be `vim` ;-)

Also, I'd prefer to have a junior human asking all the questions and making bad suggestions, so they can learn from it, and not some planet burning machine.
