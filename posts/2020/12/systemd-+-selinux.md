<!--
.. title: systemd + SELinux = 🔥
.. slug: systemd-+-selinux
.. date: 2020-12-11 18:11:30 UTC
.. tags: english,linux,software,foreman,selinux,systemd
.. category: 
.. link: 
.. description: 
.. type: text
-->

Okay, getting a title that will ensure clicks for this post was easy. Now comes the hatd part: content!

When you deploy [The Foreman](https://theforeman.org), you want a secure setup by default. That's why we ship (and enable) a SELinux policy which allows you to run the involved daemons in confined mode.

We have recently switched our default Ruby application server from Passenger (running via `mod_passenger` *inside* Apache httpd) to Puma (running standalone and Apache just being a reverse proxy). While doing so, we initially deployed Puma listening on `localhost:3000` and while `localhost` is *pretty* safe, a local user could still turn out evil and talk directly to Puma, pretending to be authenticated by Apache (think Kerberos or X.509 cert auth).

Obviously, this is not optimal, so the [next task was to switch Puma to listen on an UNIX socket](https://projects.theforeman.org/issues/30803) and only allow Apache to talk to said socket.

This doesn't sound overly complicated, [and indeed it wasn't](https://github.com/theforeman/puppet-foreman/commit/247395005a170cf4a3b462b1532bf30745a332b5). The most time/thought was spent on doing that in a way that doesn't break existing setups and still allows binding to a TCP socket for setups where users explicitly want that.

We also made a change to the SELinux policy to properly [label the newly created socket and allow httpd to access it](https://github.com/theforeman/foreman-selinux/commit/7a8c5abc846c6f968f3cee6a94f787a285c48e2e).

The whole change was carefully tested on CentOS 7 and worked like a charm. So we merged it, and it broke. Only on CentOS 8, but broken is broken, right?

This is the start of my Thanksgiving story "learn how to debug SELinux issues" ;)

From the logs of our integration test I knew the issue was Apache not being able to talk to that new socket (we archive `sos` reports as part of the tests, and those clearly had it in the `auditd` logs). But I also knew we did prepare our policy for that change, so either our preparation was not sufficient or the policy wasn't properly loaded.

The same `sos` report also contained the output of `semanage fcontext --list` which stated that all regular files called `/run/foreman.sock` would get the `foreman_var_run_t` type assigned. Wait a moment, all *regular* files?! A socket is not a regular file! Let's quickly [make that truly *all* files](https://github.com/theforeman/foreman-selinux/commit/a74b2481ce5f716a032741ceb17fa54336df5e6e). That clearly changed the `semanage fcontext --list` output, but the socket was still created as `var_run_t`?!

It was time to actually boot a CentOS 8 VM and try more things out. Interestingly, you actually can't add a rule for `/run/something`, as `/run` is an alias (equivalency in SELinux speak) for `/var/run`:

```console
# semanage fcontext --add -t foreman_var_run_t /run/foreman.sock
ValueError: File spec /run/foreman.sock conflicts with equivalency rule '/run /var/run'; Try adding '/var/run/foreman.sock' instead
```

I have no idea how the list output in the report got that `/run` rule, but [okay, let's match `/var/run/foreman.sock`](https://github.com/theforeman/foreman-selinux/commit/50d4abeb5c5b9ea423b804ee8dfc470d212b440a).

Did that solve the issue? Of course not! And you knew it, as I didn't get to the juciest part of the headline yet: systemd!

We use systemd to create the socket, as it is both convenient and useful (no more clients connecting before Rails has finished booting). But why is it wrongly labeling our freshly created socket?! A quick check with `touch` shows that the policy is correct now, the `touch`ed file gets the right type assigned. So it must be something with systemd…

A bit of poking (and good guesswork based on prior experience with a similar issue in Puppet: [PUP-2169](https://tickets.puppetlabs.com/browse/PUP-2169) and [PUP-10548](https://tickets.puppetlabs.com/browse/PUP-10548)) led to the realization that a `systemctl daemon-reexec` after adding the file context rule "fixes" the issue. Moving the poking to Google, you quickly end up at [systemd issue #9997](https://github.com/systemd/systemd/issues/9997) which is fixed in v245, but that's in no EL release yet. And indeed, the issue seems fixed on my Fedora 33 with systemd 246, but I still need it to work on CentOS 7 and 8…

Well, maybe that [reexec isn't that bad after all](https://github.com/theforeman/foreman-packaging/commit/92a8ffc2ee94bab801e39460c878e220ff2fe367)? At least the socket is now properly labeled and httpd can connect to it on CentOS 8.

Btw, no idea why the connection worked on CentOS 7, as there the socket was also wrongly labeled, but SELinux didn't deny httpd to open it.
