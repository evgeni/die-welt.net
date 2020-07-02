<!--
.. title: Automatically renaming the default git branch to "devel"
.. slug: automatically-renaming-the-default-git-branch-to-devel
.. date: 2020-07-02 07:12:21 UTC
.. tags: english,linux,planet-debian,software
.. category: 
.. link: 
.. description: 
.. type: text
-->

It seems GitHub is [planning](https://twitter.com/natfriedman/status/1271253144442253312) to [rename](https://www.zdnet.com/article/github-to-replace-master-with-alternative-term-to-avoid-slavery-references/) the [default brach](https://www.bbc.com/news/technology-53050955) for newly created repositories from "master" to "main". It's incredible how much positive PR you can get with a one line configuration change, while still working together with the ICE.

However, this post is not about bashing GitHub.

Changing the default branch for newly created repositories is good. And you also should do that for the ones [you create with `git init` locally](https://chaos.social/@ytvwld/104307561261258971). But what about all the repositories out there? GitHub surely won't force-rename those branches, but we can!

[Ian will do this as he touches the individual repositories](https://diziet.dreamwidth.org/6269.html), but I tend to forget things unless I do them immediately…

Oh, so this is another "automate everything with an API" post? Yes, yes it is!

And yes, I am going to use GitHub here, but something similar should be implementable on any git hosting platform that has an API.

Of course, if you have SSH access to the repositories, you can also just edit `HEAD` in an `for` loop in bash, but that would be boring ;-)

I'm going with `devel` btw, as I'm already used to `develop` in the Foreman project and `devel` in Ansible.

## acquire credentials

My GitHub account is 2FA enabled, so I can't just use my username and password in a basic HTTP API client. So the first step is to acquire a [personal access token](https://help.github.com/en/github/authenticating-to-github/creating-a-personal-access-token-for-the-command-line), that can be used instead. Of course I could also have implemented OAuth2 in my lousy script, but ain't nobody have time for that.

The token will require the "repo" permission to be able to change repositories.

And we'll need some boilerplate code (I'm using Python3 and `requests`, but anything else will work too):

```python
#!/usr/bin/env python3

import requests

BASE='https://api.github.com'
USER='evgeni'
TOKEN='abcdef'

headers = {'User-Agent': '@{}'.format(USER)}
auth = (USER, TOKEN)

session = requests.Session()
session.auth = auth
session.headers.update(headers)
session.verify = True
```

This will store our username, token, and create a `requests.Session` so that we don't have to pass the same data all the time.

## get a list of repositories to change

I want to change all my own repos that are not archived, not forks, and actually have the default branch set to `master`, YMMV.

As we're authenticated, we can just list the repositories of the [currently authenticated user, and limit them to "owner" only](https://developer.github.com/v3/repos/#list-repositories-for-the-authenticated-user).

GitHub uses pagination for their API, so we'll have to loop until we get to the end of the repository list.

```python
repos_to_change = []

url = '{}/user/repos?type=owner'.format(BASE)
while url:
    r = session.get(url)
    if r.ok:
        repos = r.json()
        for repo in repos:
            if not repo['archived'] and not repo['fork'] and repo['default_branch'] == 'master':
                repos_to_change.append(repo['name'])
        if 'next' in r.links:
            url = r.links['next']['url']
        else:
            url = None
    else:
        url = None
```

## create a new `devel` branch and mark it as default

Now that we know which repos to change, we need to fetch the SHA of the current `master`, create a new `devel` branch pointing at the same commit and then set that new branch as the default branch.

```python
for repo in repos_to_change:
    master_data = session.get('{}/repos/evgeni/{}/git/ref/heads/master'.format(BASE, repo)).json()
    data = {'ref': 'refs/heads/devel', 'sha': master_data['object']['sha']}
    session.post('{}/repos/{}/{}/git/refs'.format(BASE, USER, repo), json=data)
    default_branch_data = {'default_branch': 'devel'}
    session.patch('{}/repos/{}/{}'.format(BASE, USER, repo), json=default_branch_data)
    session.delete('{}/repos/{}/{}/git/refs/heads/{}'.format(BASE, USER, repo, 'master'))
```

I've also opted in to actually delete the old `master`, as I think that's the safest way to let the users know that it's gone. Letting it rot in the repository would mean people can still `pull` and won't notice that there are no changes anymore as the default branch moved to `devel`.

So…

## announcement

I've updated all my (those in the `evgeni` namespace) non-archived repositories to have `devel` instead of `master` as the default branch.

Have fun updating!

## code

```python
#!/usr/bin/env python3

import requests

BASE='https://api.github.com'
USER='evgeni'
TOKEN='abcd'

headers = {'User-Agent': '@{}'.format(USER)}
auth = (USER, TOKEN)

session = requests.Session()
session.auth = auth
session.headers.update(headers)
session.verify = True

repos_to_change = []

url = '{}/user/repos?type=owner'.format(BASE)
while url:
    r = session.get(url)
    if r.ok:
        repos = r.json()
        for repo in repos:
            if not repo['archived'] and not repo['fork'] and repo['default_branch'] == 'master':
                repos_to_change.append(repo['name'])
        if 'next' in r.links:
            url = r.links['next']['url']
        else:
            url = None
    else:
        url = None

for repo in repos_to_change:
    master_data = session.get('{}/repos/evgeni/{}/git/ref/heads/master'.format(BASE, repo)).json()
    data = {'ref': 'refs/heads/devel', 'sha': master_data['object']['sha']}
    session.post('{}/repos/{}/{}/git/refs'.format(BASE, USER, repo), json=data)
    default_branch_data = {'default_branch': 'devel'}
    session.patch('{}/repos/{}/{}'.format(BASE, USER, repo), json=default_branch_data)
    session.delete('{}/repos/{}/{}/git/refs/heads/{}'.format(BASE, USER, repo, 'master'))

```
