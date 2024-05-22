<!--
.. title: Upgrading CentOS Stream 8 to CentOS Stream 9 using Leapp
.. slug: upgrading-centos-stream-8-to-centos-stream-9-using-leapp
.. date: 2024-05-22 19:19:19 UTC
.. tags: english,linux,software,planet-debian,centos
.. category: 
.. link: 
.. description: 
.. type: text
-->

Warning to the Planet Debian readers: the following post might shock you, if you're used to Debian's smooth upgrades using only the package manager.

## Leapp?!

Contrary to distributions like [Debian](https://www.debian.org/releases/stable/amd64/release-notes/ch-upgrading.html) and [Fedora](https://docs.fedoraproject.org/en-US/quick-docs/upgrading-fedora-offline/),
RHEL can't be upgraded using the package manager alone.

Instead there is a tool called [Leapp](https://leapp.readthedocs.io/) that takes care of orchestrating the update and also includes a set of checks whether a system can be upgraded at all.
Have a look at the [RHEL documentation about upgrading](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/9/html/upgrading_from_rhel_8_to_rhel_9/index) if you want more details on the process itself.

You might have noticed that the title of this post says "CentOS Stream" but here I am talking about RHEL.
This is mostly because Leapp was originally written with RHEL in mind.

## Upgrading CentOS 7 to EL8

When people started pondering upgrading their CentOS 7 installations,
AlmaLinux started the [ELevate](https://almalinux.org/elevate/) project to allow upgrading CentOS 7 to CentOS Stream 8 but also to AlmaLinux 8, Rocky 8 or Oracle Linux 8.

ELevate was essentially Leapp with patches to allow working on CentOS, which has different package signature keys, different OS release versioning, etc.

Sadly these patches were never merged back into Leapp.

## Making Leapp work with CentOS Stream 8 (and other distributions)

At some point I noticed that things weren't moving and EL8 to EL9 upgrades were coming closer (and I had my own systems that I wanted to be able to upgrade in place).

Annoyed-Evgeni-Development is best development?
Not sure, but it produced a set of patches that allowed some movement:

* [make RedHatSignedRpmScanner distribution agnostic](https://github.com/oamg/leapp-repository/pull/876) allowed Leapp to load GPG keys for alternative distributions, thus correctly identifying their packages
* [call correct mkdir when trying to create /etc/rhsm/facts](https://github.com/oamg/leapp-repository/pull/1132) made Leapp not crash on systems without `/etc/rhsm`, like those not subscribed to Red Hat
* [default to NO_RHSM mode when subscription-manager is not found](https://github.com/oamg/leapp-repository/pull/1133) made Leapp work better out of the box on systems without subscriptions
* [load all substitutions from etc](https://github.com/oamg/leapp-repository/pull/1134) made Leapp work properly on distributions that ship additional repository URL substitutions
* [be less strict when figuring out major version in initrd](https://github.com/oamg/leapp-repository/pull/1140) made Leapp work with CentOS Stream initrds that have non X.Y versions

However, this is not yet the end of the story.
At least [convert dot-less CentOS versions to X.999](https://github.com/oamg/leapp-repository/pull/1139) is open,
and another followup would be needed if we go that route.
But I don't expect this to be merged soon, as the patch is *technically* wrong - yet it makes things mostly work.

The big problem here is that CentOS Stream doesn't have X.Y versioning, just X as it's a constant stream with no point releases.
Leapp however relies on X.Y versioning to know which package changes it needs to perform.
Pretending CentOS Stream 8 is "RHEL" 8.999 works if you assume that Stream is always ahead of RHEL.

This is however a CentOS only problem.
I still need to properly test that, but I'd expect things to work fine with upstream Leapp on AlmaLinux/Rocky if you feed it the right signature and repository data.

## Actually upgrading CentOS Stream 8 to CentOS Stream 9 using Leapp

Like I've already teased in my [HPE rant](/2024/05/using-hponcfg-on-centos-stream-9-with-openssl-32/),
I've actually used that code to upgrade `virt01.conova.theforeman.org` to CentOS Stream 9.
I've also used it to upgrade a server at home that's responsible for running important containers like Home Assistant and UniFi.
So it's absolutely battle tested and production grade! It's also hungry for kittens.

As mentioned above, you can't just use upstream Leapp, but I have a [Copr: evgeni/leapp](https://copr.fedorainfracloud.org/coprs/evgeni/leapp/).

```console
# dnf copr enable evgeni/leapp
# dnf install leapp leapp-upgrade-el8toel9
```

Apart from the software, we'll also need to tell it which repositories to use for the upgrade.
```console
# vim /etc/leapp/files/leapp_upgrade_repositories.repo
[c9-baseos]
name=CentOS Stream $releasever - BaseOS
metalink=https://mirrors.centos.org/metalink?repo=centos-baseos-9-stream&arch=$basearch&protocol=https,http
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-centosofficial
gpgcheck=1
repo_gpgcheck=0
metadata_expire=6h
countme=1
enabled=1

[c9-appstream]
name=CentOS Stream $releasever - AppStream
metalink=https://mirrors.centos.org/metalink?repo=centos-appstream-9-stream&arch=$basearch&protocol=https,http
gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-centosofficial
gpgcheck=1
repo_gpgcheck=0
metadata_expire=6h
countme=1
enabled=1
```

Depending on the setup and installed packages, more repositories might be needed.
Just make sure that the `$stream` substitution is not used as Leapp doesn't override that and you'd end up with CentOS Stream 8 repos again.

Once all that is in place, we can call `leapp preupgrade` and let it analyze the system.

Ideally, the output will look like this:

```console
# leapp preupgrade
…
============================================================
                      REPORT OVERVIEW                       
============================================================

Reports summary:
    Errors:                      0
    Inhibitors:                  0
    HIGH severity reports:       0
    MEDIUM severity reports:     0
    LOW severity reports:        3
    INFO severity reports:       3

Before continuing consult the full report:
    A report has been generated at /var/log/leapp/leapp-report.json
    A report has been generated at /var/log/leapp/leapp-report.txt

============================================================
                   END OF REPORT OVERVIEW                   
============================================================
```

But trust me, it won't ;-)

As mentioned above, Leapp analyzes the system before the upgrade.
Some checks can completely inhibit the upgrade, while others will just be logged as "you better should have a look".

### Firewalld Configuration `AllowZoneDrifting` Is Unsupported

EL7 and EL8 shipped with `AllowZoneDrifting=yes`, but since EL9 this is not supported anymore.
As this can potentially break the networking of the system, the upgrade gets inhibited.

### Newest installed kernel not in use

Admit it, you also don't reboot into every new kernel available!
Well, Leapp won't let that pass and inhibits the upgrade.

### Cannot perform the VDO check of block devices

In EL8 there are two ways to manage VDO: using the dedicated `vdo` tool and via LVM.
If your system uses LVM (it should!) but not VDO, you probably don't have the `vdo` package installed.
But then Leapp can't check if your LVM devices really aren't VDO without the `vdo` tooling and will inhibit the upgrade.
So you gotta install `vdo` for it to find out that you don't use VDO…

### LUKS encrypted partition detected

Yeah. Sorry.
Using LUKS? Straight into the inhibit corner!

But hey, if you don't use LUKS for `/` you can probably get away by deleting the `inhibitwhenluks` actor.
That worked for me, but remember the kittens!

## Really upgrading CentOS Stream 8 to CentOS Stream 9 using Leapp

The headings are getting silly, huh?

Anyway, once `leapp preupgrade` is happy and doesn't throw any inhibitors anymore,
the actual (real?) upgrade can be done by calling `leapp upgrade`.

This will download all necessary packages and create an intermediate initramfs that contains all the things needed for the upgrade and ask you to reboot.

Once booted, the upgrade itself takes somewhere between 5 and 10 minutes.
Then another minute or 5 to relabel your disks with the new SELinux policy.

And three reboots (into the upgrade initramfs, into SELinux relabel, into real OS) of a ProLiant DL325 - 5 minutes each? 😿

And then for good measure another one, to flip SELinux from permissive to enforcing.

Are we done yet? Nope.

There are a few [post-upgrade tasks](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/9/html/upgrading_from_rhel_8_to_rhel_9/performing-post-upgrade-tasks-on-the-rhel-9-system_upgrading-from-rhel-8-to-rhel-9) you get to do yourself.
Yes, the switching of SELinux back to `enforcing` is one of them.
Please don't forget it.

## Using the system after the upgrade

A customer once said "We're not running those systems for the sake of running systems, but for the sake of running some application ontop of them".
This is very true.

### libvirt doesn't support Spice/QXL

In EL9, support for Spice/QXL [was](https://bugzilla.redhat.com/show_bug.cgi?id=2030592) [dropped](https://issues.redhat.com/browse/RHEL-16530), so if you try to boot a VM using it, libvirt will nicely error out with

```
Error starting domain: unsupported configuration: domain configuration does not support video model 'qxl'
```

Interestingly, because multiple parts of the VM are invalid, you can't edit it in `virt-manager` (at least the one in Fedora 39) as removing/fixing one part requires applying the new configuration which is still invalid.

So `virsh edit <vm>` it is!

Look for entries like 

```xml
    <channel type='spicevmc'>
      <target type='virtio' name='com.redhat.spice.0'/>
      <address type='virtio-serial' controller='0' bus='0' port='2'/>
    </channel>
    <graphics type='spice' autoport='yes'>
      <listen type='address'/>
    </graphics>
    <audio id='1' type='spice'/>
    <video>
      <model type='qxl' ram='65536' vram='65536' vgamem='16384' heads='1' primary='yes'/>
      <address type='pci' domain='0x0000' bus='0x00' slot='0x01' function='0x0'/>
    </video>
    <redirdev bus='usb' type='spicevmc'> 
      <address type='usb' bus='0' port='2'/> 
    </redirdev> 
    <redirdev bus='usb' type='spicevmc'> 
      <address type='usb' bus='0' port='3'/> 
    </redirdev>
```

and either just delete the or (better) replace them with VNC/cirrus

```xml
    <graphics type='vnc' port='-1' autoport='yes'>
      <listen type='address'/>
    </graphics>
    <audio id='1' type='none'/>
    <video>
      <model type='cirrus' vram='16384' heads='1' primary='yes'/>
      <address type='pci' domain='0x0000' bus='0x00' slot='0x01' function='0x0'/>
    </video>
```

### Podman needs re-login to private registries

One of the machines I've updated runs Podman and pulls containers from GitHub which are marked as private.
To do so, I have a personal access token that I've used to login to `ghcr.io`.
After the CentOS Stream 9 upgrade (which included an upgrade to Podman 5), pulls stopped working with authentication/permission errors.
No idea what exactly happened, but a simple `podman login` fixed this issue quickly.

```console
$ echo ghp_token | podman login ghcr.io -u <user> --password-stdin
```

### `shim` has an `el8` tag

One of the [documented post-upgrade tasks](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/9/html/upgrading_from_rhel_8_to_rhel_9/performing-post-upgrade-tasks-on-the-rhel-9-system_upgrading-from-rhel-8-to-rhel-9) is to verify that no EL8 packages are installed, and to remove those if there are any.

However, when you do this, you'll notice that the `shim-x64` package has an EL8 version: `shim-x64-15-15.el8_2.x86_64`.

That's because [the same build is used in both CentOS Stream 8 and CentOS Stream 9](https://kojihub.stream.centos.org/koji/buildinfo?buildID=3875). Confusing, but should really not be uninstalled if you want the machine to boot ;-)

## Are we done yet?

Yes! That's it. Enjoy your CentOS Stream 9!
