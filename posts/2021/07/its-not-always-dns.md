<!--
.. title: It's not *always* DNS
.. slug: its-not-always-dns
.. date: 2021-07-23 18:36:34 UTC
.. tags: english,planet-debian,software,linux,foreman
.. category: 
.. link: 
.. description: 
.. type: text
-->

Two weeks ago, I had the pleasure to play with [Foreman](https://theforeman.org)s Kerberos integration and iron out a few long standing kinks.

It all started with a user reminding us that [Kerberos authentication is broken when Foreman is deployed on CentOS 8](https://projects.theforeman.org/issues/32352), as there is no more [`mod_auth_kerb`](http://modauthkerb.sourceforge.net/) available. Given `mod_auth_kerb` hasn't seen a release since 2013, this is quite understandable. Thankfully, there is a replacement available, [`mod_auth_gssapi`](https://github.com/gssapi/mod_auth_gssapi). Even better, it's available in CentOS 7 and 8 and in Debian and Ubuntu too!

So I quickly whipped up a [PR to completely replace `mod_auth_kerb` with `mod_auth_gssapi` in our installer](https://github.com/theforeman/puppet-foreman/pull/967) and successfully tested that it still works in CentOS 7 (even if upgrading from a `mod_auth_kerb` installation) and CentOS 8. 

Yay, the issue at hand seemed fixed. But just writing a post about that would've been boring, huh?

Well, and then I dared to test the same on Debian…

Turns out, our installer was using the [wrong path to the Apache configuration and the wrong username Apache runs under](https://projects.theforeman.org/issues/32947) while trying to setup Kerberos, so it could not have ever worked. Luckily [Ewoud](https://github.com/ekohl) and I were [able to fix that too](https://github.com/theforeman/puppet-foreman/pull/968). And yet the installer was still unable to fetch the keytab from my FreeIPA server 😿

Let's dig deeper! To fetch the keytab, the installer does roughly this:

```console
# kinit -k
# ipa-getkeytab -k http.keytab -p HTTP/foreman.example.com
```

And if one executes that by hand to see the a actual error, you see:

```console
# kinit -k
kinit: Cannot determine realm for host (principal host/foreman@)
```

Well, yeah, the principal looks kinda weird (no realm) and the interwebs say for "kinit: Cannot determine realm for host":

* Kerberos cannot determine the realm name for the host. (Well, duh, that's what it said?!)
* Make sure that there is a default realm name, or that the domain name mappings are set up in the Kerberos configuration file (krb5.conf)

And guess what, all of these are perfectly set by `ipa-client-install` when joining the realm…

But there must be something, right? Looking at the principal in the error, it's missing both the domain of the host and the realm.
I was pretty sure that my DNS and config was right, but what about [`gethostname(2)`](https://man7.org/linux/man-pages/man2/gethostname.2.html)?

```console
# hostname
foreman
```

Bingo! Let's see what happens if we force that to be an FQDN?

```console
# hostname foreman.example.com
# kinit -k
```

NO ERRORS! NICE!

We're doing science here, right? And I still have the CentOS 8 box I had for the previous round of tests.
What happens if we set that to have a shortname? Nothing. It keeps working fine.
And what about CentOS 7? VMs are cheap. Well, that breaks like on Debian, if we force the hostname to be short. Interesting.

Is it a version difference between the systems?

* Debian 10 has krb5 1.17-3+deb10u1
* CentOS 7 has krb5 1.15.1-50.el7
* CentOS 8 has krb5 1.18.2-8.el8

So, something changed in 1.18?

Looking at the [krb5 1.18 changelog](https://web.mit.edu/kerberos/krb5-1.18/) the following entry jumps at one:
*Expand single-component hostnames in host-based principal names when DNS canonicalization is not used, adding the system's first DNS search path as a suffix.*

Given Debian 11 has krb5 1.18.3-5 (well, testing has, so lets pretend bullseye will too), we can retry the experiment there, and it shows that it works with both, short and full hostname.
So yeah, it seems krb5 "does the right thing" since 1.18, and before that `gethostname(2)` *must* return an FQDN.

[I've documented that for our users and can now sleep a bit better](https://github.com/theforeman/foreman-documentation/pull/594). At least, it wasn't DNS, right?!

Btw, [`freeipa` won't be in bulsseye](https://tracker.debian.org/pkg/freeipa), which makes me a bit sad, as that means that Foreman won't be able to automatically join FreeIPA realms if deployed on Debian 11.
