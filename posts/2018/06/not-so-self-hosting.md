<!--
.. title: Not-So-Self-Hosting
.. slug: not-so-self-hosting
.. date: 2018-06-06 09:54:56 UTC
.. tags: english,linux,planet-debian,software
.. category:
.. link:
.. description:
.. type: text
-->

I planned to write about this for quite some time now (last time [end of April](https://twitter.com/zhenech/status/991007615474982912)), and now, thanks to the GitHub acquisition by Microsoft and all that [#movingtogitlab](https://twitter.com/search?q=%23movingtogitlab) traffic, I am finally sitting here and writing these lines.

This post is not about Microsoft, GitHub or GitLab, and it's neither about any other SaaS solution out there, the named companies and products are just examples. It's more about "do you really want to self-host?"

Every time a big company [acquires](https://blog.github.com/2018-06-04-github-microsoft/), [shuts down](https://opensource.googleblog.com/2015/03/farewell-to-google-code.html) or [changes](https://en.wikipedia.org/wiki/SourceForge#Controversies) an online service (SaaS - Software as a Service), you hear people say "told you so, you should better have self-hosted from the beginning". And while I do run quite a lot of own infrastructure, I think this statement is too general and does not work well for many users out there.

# Software as a Service

There are many code-hosting SaaS offerings: [GitHub](https://github.com/) (proprietary), [GitLab](https://gitlab.com/) (open core), [Pagure](https://pagure.io/) (FOSS) to name just a few.
And while their licenses, ToS, implementations and backgrounds differ, they have a few things in common.

Benefits:

* (sort of) centralized service
* free (as in beer) tier available
* high number of users (and potential collaborators)
* high number of hosted projects
* good (fsvo "good") connection from around the globe
* no maintenance required from the users

Limitations:

* dependency on the interest/goodwill of the owner to continue the service
* some features might require signing up for a paid tier

Overall, SaaS is handy if you're lazy, just want to get the job done and benefit from others being able to easily contribute to your code.

# Hosted Solutions

All of the above mentioned services also offer a hosted solution: [GitHub Enterprise](https://enterprise.github.com/home), [GitLab CE and EE](https://about.gitlab.com/installation/), [Pagure](https://pagure.io/pagure).

As those are software packages you can install essentially everywhere, you can host the service "in your basement", in the cloud or in any data center you have hardware or VMs running.

However, with self-hosting, the above list of common things shifts quite a bit.

Benefits:

* the service is configured and secured exactly like you need it
* the data remains inside your network/security perimeter if you want it

Limitations:

* requires users to create an own account on your instance for collaboration
* probably low number of users (and potential collaborators)
* connection depends on your hosting connection
* infrastructure (hardware, VM, OS, software) requires regular maintenance
* dependency on your (free) time to keep the service running
* dependency on your provider (network/hardware/VM/cloud)

I think especially the first and last points are very important here.

First, many contributions happen because someone sees something small and wants to improve it, be it a typo in the documentation, a formatting error in the manpage or a trivial improvement of the code. But these contributions only happen when the complexity to submit it is low. Nobody not already involved in OpenStack would submit a typo-fix to their Gerrit which needs a Launchpad account… A small web-edit on GitHub or GitLab on the other hand is quickly done, because "everybody" has an account anyways.

Second, while it is called "self-hosting", in most cases it's more of a "self-running" or "self-maintaining" as most people/companies don't own the whole infrastructure stack.

Let's take this website as an example (even though it does not host any Git repositories): the webserver runs in a container (LXC) on a VM I rent from [netcup](https://www.netcup.de/). In the past, netcup used to get their infrastructure from [Hetzner](https://www.hetzner.de) - however I am not sure that this is still the case. So worst case, the hosting of this website depends on me maintaining the container and the container host, netcup maintaining the virtualization infrastructure and Hetzner maintaining the actual data center. This also implies that I have to trust those companies and their suppliers as I only "own" the VM upwards, not the underlying infrastructure and not the supporting infrastructure (network etc).

# SaaS vs Hosted

There is no silver bullet to that. One important question is "how much time/effort can you afford?" and another "which security/usability constraints do you have?".

## Hosted for a dedicated group

If you need a solution for a dedicated group (your work, a big FOSS project like [Debian](https://salsa.debian.org) or a social group like [riseup](https://0xacab.org)), a hosted solution seems like a good idea. Just ensure that you have enough infrastructure and people to maintain it as a 24x7 service or at least close to that, for a long time, as people will depend on your service.

The same also applies if you need/want to host your code inside your network/security perimeter.

## Hosted for an individual

Contrary to a group, I don't think a hosted solution makes sense for an individual most of the time. The burden of maintenance quite often outweighs the benefits, especially as you'll have to keep track of (security) updates for the software and the underlying OS as otherwise the "I own my data" benefit becomes "everyone owns me" quite quickly. You also have to pay for the infrastructure, even if the OS and the software are FOSS.

You're also probably missing out on potential contributors, which might have an account on the common SaaS platforms, but won't submit a pull-request for a small change if they have to register on your individual instance.

## SaaS for a dedicated group

If you don't want to maintain an own setup (resources/costs), you can also use a SaaS platform for a group. Some SaaS vendors will charge you for some features (they have to pay their staff and bills too!), but it's probably still cheaper than having the right people in-house unless you have them anyways.

You also benefit from a networking effect, as other users of the same SaaS platform can contribute to your projects "at no cost".

## Saas for an individual

For an individual, a SaaS solution is probably the best fit as it's free (as in beer) in the most cases and allows the user to do what they intend to do, instead of shaving yaks and stacking turtles (aka maintaining infrastructure instead of coding).

And you again get the networking effect of the drive-by contributors who would not sign up for a quick fix.

# Selecting the right SaaS

When looking for a SaaS solution, try to answer the following questions:

* Do you trust the service to be present next year? In ten years? Is there a sustainable business model?
* Do you trust the service with your data?
* Can you move between SaaS and hosted easily?
* Can you move to a *different* SaaS (or hosted solution) easily?
* Does it offer all the features and integrations you want/need?
* Can you leverage the network effect of being on the same platform as others?

# Selecting the right hosted solution

And answer these when looking for a hosted one:

* Do you trust the vendor to ship updates next year? In ten years?
* Do you understand the involved software stack and willing to debug it when things go south?
* Can you get additional support from the vendor (for money)?
* Does it offer all the features and integrations you want/need?

# So, do you really want to self-host?

I can't speak for you, but for my part, I don't want to run a full-blown Git hosting just for my projects, GitHub is just fine for that. And yes, GitLab would be equally good, but there is little reason to move at the moment.

And yes, I do run my own Nextcloud instance, mostly because I don't want to backup the pictures from my phone to "a cloud". YMMV.
