<!--
.. title: naked pings 2020
.. slug: naked-pings-2020
.. date: 2020-06-14 13:59:28 UTC
.. tags: english,linux,planet-debian,software
.. category: 
.. link: 
.. description: 
.. type: text
-->

[ajax' post about "ping" etiquette](https://blogs.gnome.org/markmc/2014/02/20/naked-pings/) is over 10 years old, but holds true until this day. So true, that my IRC client at work has a [script, that will reply with a link to it each time I get a naked ping](https://github.com/clouserw/scripts/blob/master/autopong.py).

But IRC is not the only means of communication. There is also mail, (video) conferencing, and GitHub/GitLab. Well, at least in the software engineering context. Oh and yes, it's 2020 and I still (proudly) have no Slack account.

Thankfully, (naked) pings are not really a thing for mail or conferencing, but I see an increasing amount of them on GitHub and it bothers me, a lot. As there is no direct messaging on GitHub, you might rightfully ask why, as there is always context in form of the issue or PR the ping happened in, so lean back an listen ;-)

## notifications become useless

While there might be context in the issue/PR, there is none (besides the title) in the notification mail, and not even the title in the notification from the Android app (which I have installed as I use it lot for smaller reviews). So the ping will always force a full context switch to open the web view of the issue in question, removing the possibility to just swipe away the notification/mail as "not important right now".

## even some context is not enough context

Even after visiting the issue/PR, the ping quite often remains non-actionable. Do you want me to debug/fix the issue? Review the PR? Merge it? Close it? I don't know!

The only actionable ping is when the previous message is directed at me and has an actionable request in it and the ping is just a reminder that I have to do it. And even then, why not write "hey @evgeni, did you have time to process my last question?" or something similar?

BTW, this is also what I dislike about ajax' minimal example "ping re bz 534027" - what am I supposed to do with that BZ?!

## why me anyways?!

Unless I am the only maintainer of a repo or the author of the issue/PR, there is usually no reason to ping *me* directly. I might be sick, or on holiday, or currently not working on that particular repo/topic or whatever. Any of that will result in you thinking that your request will be prioritized, while in reality it won't. Even worse, somebody might come across it, see me mentioned and think "ok, that's Evgeni's playground, I'll look elsewhere".

Most organizations have groups of people working on specific topics. If you know the group name and have enough permissions (I am not exactly sure which, just that GitHub have limits to avoid spam, sorry) you can ping **@organization/group** and everyone in that group will get a notification. That's far from perfect, but at least this will get the attention of the right people. Sometimes there is also a bot that will either automatically ping a group of people or you can trigger to do so.

Oh, and I'm getting paid for work on open source. So if you end up pinging me in a work-related repository, there is a high chance I will only process that during work hours, while another co-worker might have been available to help you out almost immediately.

## be patient

Unless we talked on another medium before and I am waiting for it, please don't ping *directly* after creation of the issue/PR. Maintainers get notifications about new stuff and will triage and process it at some point.

## conclusion

If you feel called out, please don't take it personally. Instead, please try to provide as much actionable information as possible and be patient, that's the best way to get a high quality result.

I will ignore pings where I don't immediately know what to do, and so should you.

## one more thing

Oh, and if you ping me on IRC, with context, and then disconnect before I can respond…

In the past you would sometimes get a reply by mail. These days the request will be most probably ignored. I don't like talking to the void. Sorry.
