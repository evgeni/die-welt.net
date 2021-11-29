<!--
.. title: Getting access to somebody else's Ansible Galaxy namespace
.. slug: getting-access-to-somebody-elses-ansible-galaxy-namespace
.. date: 2021-11-29 08:00:00 UTC
.. tags: english,planet-debian,software,linux
.. category: 
.. link: 
.. description: 
.. type: text
-->

TL;DR: adding features after the fact is hard, normalizing names is hard, it's patched, carry on.

I promise, the longer version is more interesting and fun to read!

Recently, I was poking around [Ansible Galaxy](https://galaxy.ansible.com) and almost accidentally got access to someone else's namespace. I was actually looking for something completely different, but accidental finds are the best ones!

If you're asking yourself: "what the heck is he talking about?!", let's slow down for a moment:

* [Ansible](https://ansible.com) is a great automation engine built around the concept of modules that do things (mostly written in Python) and playbooks (mostly written in YAML) that tell which things to do
* [Ansible Galaxy](https://galaxy.ansible.com) is a place where people can share their playbooks and modules for others to reuse
* [Galaxy Namespaces](https://galaxy.ansible.com/docs/contributing/namespaces.html) are a way to allow users to distinguish who published what and reduce name clashes to a minimum

That means that if I ever want to share how to automate installing `vim`, I can publish `evgeni.vim` on Galaxy and other people can download that and use it. And if my evil twin wants their `vim` recipe published, it will end up being called `evilme.vim`. Thus while both recipes are called `vim` they can coexist, can be downloaded to the same machine, and used independently.

How do you get a namespace? It's automatically created for you when you login for the first time. After that you can manage it, you can upload content, [allow others to upload content and other things](https://galaxy.ansible.com/docs/contributing/namespaces.html#adding-administrators-to-a-namespace). You can also [request additional namespaces](https://galaxy.ansible.com/docs/contributing/namespaces.html#requesting-additional-namespaces), this is useful if you want one for an Organization or similar entities, which don't have a login for Galaxy.

Apropos login, Galaxy uses GitHub for authentication, so you don't have to store yet another password, just smash that octocat!

Did anyone actually click on those links above? If you did (you didn't, right?), you might have noticed another section in that document: [Namespace Limitations](https://galaxy.ansible.com/docs/contributing/namespaces.html#namespace-limitations). That says:
> Namespace names in Galaxy are limited to lowercase word characters (i.e., a-z, 0-9) and ‘\_’, must have a minimum length of 2 characters, and cannot start with an ‘\_’. No other characters are allowed, including ‘.’, ‘-‘, and space.
> The first time you log into Galaxy, the server will create a Namespace for you, if one does not already exist, by converting your username to lowercase, and replacing any ‘-‘ characters with ‘\_’.

For my login `evgeni` this is pretty boring, as the generated namespace is also `evgeni`. But for the GitHub user `Evil-Pnwil-666` it will become `evil_pnwil_666`. This can be a bit confusing.

Another confusing thing is that Galaxy supports two types of content: [roles](https://docs.ansible.com/ansible/latest/user_guide/playbooks_reuse_roles.html) and [collections](https://docs.ansible.com/ansible/latest/user_guide/collections_using.html), but namespaces are only for collections! So it is `Evil-Pnwil-666.vim` if it's a role, but `evil_pnwil_666.vim` if it's a collection.

I think part of this split is because collections were added much later and have a much more well thought design of both the artifact itself and its delivery mechanisms.

This is by the way very important for us! Due to the fact that collections (and namespaces!) were added later, there must be code that ensures that users who were created *before* also get a namespace.

Galaxy does this (and I would have done it the same way) by hooking into the login process, and after the user is logged in it checks if a Namespace exists and if not it creates one and sets proper permissions.

And this is also exactly where the issue was!

The old code looked like this:

```python
    # Create lowercase namespace if case insensitive search does not find match
    qs = models.Namespace.objects.filter(
        name__iexact=sanitized_username).order_by('name')
    if qs.exists():
        namespace = qs[0]
    else:
        namespace = models.Namespace.objects.create(**ns_defaults)

    namespace.owners.add(user)
```

See how `namespace.owners.add` is *always* called? Even if the namespace already existed? Yepp!

But how can we exploit that? Any user either already has a namespace (and owns it) or doesn't have one that could be owned. And given users are tied to GitHub accounts, there is no way to confuse Galaxy here. Now, remember how I said one could request *additional* namespaces, for organizations and stuff? Those will have owners, but the namespace name might not correspond to an existing user!

So all we need is to find an existing Galaxy namespace that is not a "default" namespace (aka a specially requested one) and get a GitHub account that (after the funny name conversion) matches the namespace name.

Thankfully Galaxy has an API, so I could dump *all* existing namespaces and their owners. Next I filtered that list to have only namespaces where the owner list doesn't contain a username that would (after conversion) match the namespace name. I found a few. And for one of them (let's call it `the_target`), the corresponding GitHub username (`the-target`) was available! Jackpot!

I've registered a new GitHub account with that name, logged in to Galaxy and [had access to the previously found namespace](https://twitter.com/zhenech/status/1380180208251252743).

This felt like sufficient proof that my attack worked and I mailed my findings to the Ansible Security team. The issue was fixed in [d4f84d3400f887a26a9032687a06dd263029bde3](https://github.com/ansible/galaxy/commit/d4f84d3400f887a26a9032687a06dd263029bde3) by moving the `namespace.owners.add` call to the "new namespace" branch.

And this concludes the story of how I accidentally got access to someone else's Galaxy namespace (which was revoked after the report, no worries).
