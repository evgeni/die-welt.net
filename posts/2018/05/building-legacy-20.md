<!--
.. title: Building Legacy 2.0
.. slug: building-legacy-20
.. date: 2018-05-27 15:15:34 UTC
.. status: draft
.. tags: english,linux,planet-debian,software
.. category:
.. link:
.. description:
.. type: text
-->

I've recently read an article by my dear friend and colleague [@liquidat](https://twitter.com/liquidat) about [using Ansible to manage RHEL5](https://www.ansible.com/blog/using-ansible-to-manage-rhel-5-yesterday-today-and-tomorrow) and promised him a nice ~~bashing~~reply.

# Background
Ansible, while being agent-less, is not interpreter-less and requires a working Python installation on the target machine. Up until Ansible 2.3 the minimum Python version was 2.4, which is available in EL5. Starting with Ansible 2.4 this requirement has been bumped to Python 2.6 to accommodate future compatibility with Python 3. Sadly Python 2.6 is not easily available for EL5 and people who want/need to manage such old systems with Ansible have to find a new way to do so.

First, I think it's actually not possible to effectively *manage* a RHEL5 (or any other legacy/EOL system). Running ad-hoc changes in a mostly controlled manner - yes, but not fully manage them. Just imagine how much cruft might have been collected on a system that was first released in 2007 (that's as old as Debian 4.0 Etch). To properly manage a system you need to be aware of its whole lifecycle, and that's simply not the case here. But this is not the main reason I wanted to write this post.

# Possible solutions
liquidat's article shows three ways to apply changes to an EL5 system, which I'd like to discuss.

## Use the power of RAW
Ansible contains two modules (`raw` and `script`) that don't require Python at all and thus can be used on "any" target. While this is true, you're also losing about every nice feature and safety net that Ansible provides you with its Python-based modules. The `raw` and `script` modules are useful to bootstrap Python on a target system, but that's about it. When using these modules, Ansible becomes a glorified wrapper around `scp` and `ssh`. With almost the same benefits you could use that `for`-loop that has been lingering in your shell history since 1998.

Using Ansible for the sake of being able to say "I used Ansible"? Nope, not gonna happen.

Also, this makes all the playbooks that were written for Ansible 2.3 unusable and widens the gap between the EL5 systems and properly managed ones :(

## Upgrade to a newer Python version
You can't just upgrade the system Python to a newer verion in EL5, too many tools expect it to be 2.4. But you can install a second version, parallel to the current one.

There are just a few gotchas with that:
1. The easiest way to get a newer Python for EL5 is to install `python26` from EPEL. But EPEL for EL5 is EOL and does not get any updates anymore.
2. Python 2.6 is also EOL itself and I am not aware of any usable 2.7 packages for EL5.
3. While you might get Python 2.6 working, what's about all the libs that you might need for the various Ansible modules? The system ones will pretty sure not work for 2.6.
4. (That's my favorite) Are you sure there are no (init) scripts that check for the existence of `/usr/bin/python26` and execute the code with that instead of the system Python? Now see 3, 2 and 1 again. Initially you said "but it's only for Ansible", right?
5. Oh, and where do you get an approval for such a change of production systems anyways? ;)

Also, this kinda reminds me of the ["Python environment" XKCD](https://xkcd.com/1987/):

![XKCD: Python Environment](https://imgs.xkcd.com/comics/python_environment.png)

## Use Ansible 2.3
This is probably the sanest option available. It does not require changes to your managed systems. Neither does not limit you (a lot) in what you can do in your playbooks.

[If only Ansible 2.3 was still supported and getting updates…](http://docs.ansible.com/ansible/devel/reference_appendices/release_and_maintenance.html)

And yet, I still think that's the sanest solution available. Just make sure you don't use any modules that communicate with the world (which includes the `dig` lookup!) and only use 2.3 on an as-needed basis for EL5 hosts.

# Conclusion
First of all, please get rid of those EL5 systems. The [Extended Life-cycle Support for them ends in 2020](https://access.redhat.com/support/policy/updates/errata) and nobody even talks about support for the hardware it's running on. Document the costs and risks those systems are bringing into the environment and get the workloads migrated, please. (I wrote"please" twice in a paragraph, it must be really important).

I called this post "Building Legacy 2.0" because I fear that's a recurring pattern we'll be seeing. On the one hand legacy systems that need to be kept alive. On the other the wish (and also pressure) to introduce automation with tools that are either not compatible with those legacy systems today or won't be tomorrow as the tool develop much faster than the systems you control using them.

And by still forcing those tools into our legacy environments, we just add more oil to the fire. Instead of maintaining that legacy system, we now also maintain a legacy automation stack to pseudo-manage that legacy system. More legacy, yay.
