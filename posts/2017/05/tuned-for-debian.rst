.. title: tuned for Debian
.. slug: tuned-for-debian
.. date: 2017-05-03 19:47:25 UTC
.. tags: debian,english,linux,planet-debian,software
.. category: 
.. link: 
.. description: 
.. type: text

For quite some time I wanted to have tuned_ in Debian, but somehow never motivated myself to do the packaging.
Two weeks ago I then finally decided to pick it up (esp. as mika and a few others were asking about it).

There was an old RFP/ITP `789592`_, without much progress, so I did the packing from scratch (heavy based on the `Fedora package`_).
gustavo (the owner of the ITP) also joined the effort, and shortly after the `upstream release of 2.8.0`_ we had `tuned in Debian`_ (with a *very* short time in NEW, thanks ftp-masters!).

I am quite sure that the package is far from perfect yet, especially as the software is primary built for and tested on Fedora/CentOS/RHEL. So keep the bugs, suggestions and patches comming (`thanks mika`_!).

.. _tuned: http://www.tuned-project.org/
.. _789592: https://bugs.debian.org/789592
.. _Fedora package: https://pkgs.fedoraproject.org/cgit/rpms/tuned.git
.. _upstream release of 2.8.0: http://www.tuned-project.org/2017/04/27/tuned-2-8-0-released/
.. _tuned in Debian: https://tracker.debian.org/news/844655
.. _thanks mika: https://anonscm.debian.org/cgit/collab-maint/tuned.git/commit/?id=98150eee3a789767f2233cc573ae59552f1d511b
