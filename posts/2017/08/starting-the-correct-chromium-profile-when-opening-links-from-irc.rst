.. title: starting the correct Chromium profile when opening links from IRC
.. slug: starting-the-correct-chromium-profile-when-opening-links-from-irc
.. date: 2017-08-27 16:18:51 UTC
.. tags: english,linux,planet-debian,software
.. category: 
.. link: 
.. description: 
.. type: text

I am using Chromium/Chrome as my main browser and I also use its profile/people feature to separate my work profile (bookmarks, cookies, etc) from my private one.

However, Chromium always opens links in the last window (and by that profile) that was in foreground last. And that is pretty much not what I want. Especially if I open a link from IRC and it might lead to some shady rick-roll page.

Thankfully, getting the list of available Chromium profiles is pretty easy and so is displaying a few buttons using Python.

To do so I wrote cadmium_, which scans the available Chromium profiles and allows to start either of them, or Chromium's Incognito Mode. On machines with SELinux it can even launch Chromium in the SELinux sandbox.

No more links opened in the wrong profile. Yay!

.. _cadmium: https://github.com/evgeni/cadmium
