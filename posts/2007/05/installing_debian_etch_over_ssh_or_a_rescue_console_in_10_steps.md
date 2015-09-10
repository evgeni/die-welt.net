<html><body><p>Who does not know such a situation: you get a new box in the data center but not with your favorite Debian but with $FOOBAR, or the hard-drive of your box just died and you need to reinstall the system without sitting in front of it. I think everyone knows this, or can imagine it. Here is a small howto you can follow to install Debian Etch (and Sarge, Lenny, Sid, whatever) on a remote system with only SSH enabled.<br>
<br>
<strong>1. boot up the box in rescue mode</strong><br>
I don't want to destroy my server, so I use a bit of virtualization: I boot grml with <strong>qemu -hda etch -cdrom ~/grml_small_0.3.iso -boot d -m 256 -redir tcp:5555:10.0.2.15:22</strong>, setup ssh and I'm ready.<br>
In the case of cases you'll have to boot up the machine into rescue mode by calling the data center or clicking a link in the configuration interface.<br>
<br>
<strong>2. login as root into the box, this should be easy ;)</strong><br>
(I do ssh -l root -p 5555 localhost for the qemu-redirect)<br>
<br>
<strong>3. create the needed partitions</strong><br>
I'll do a basic install: 100MiB /boot, 1.5GiB /, 400MiB swap (my qemu has only a 2GiB image here), you should have thought about your partitions before installing ;-)<br>
Now I call <strong>cfdisk /dev/hda</strong> and create my paritions (you of course can use a partition-tool you want, but fdisk and cfdisk are usualy installed, others maybe not).<br>
After that you need a filesystem - I prefer ext3, so I do <strong>mkfs.ext3</strong> twice - you maybe want to tweak it with some options - feel free to do that and don't forget <strong>mkswap</strong> ;)<br>
<br>
<strong>4. prepare for teh ownage</strong><br>
<strong>mkdir /mnt/etch<br>
mount /dev/hda2 /mnt/etch<br>
debootstrap etch /mnt/etch http://your.local.mirr.or/debian</strong><br>
Now a basic Debian Etch is installed, but we still need some more things there, so we chroot inside...<br>
<br>
<strong>5. chroot</strong><br>
<strong>mount -t proc proc /mnt/etch/proc<br>
chroot /mnt/etch /bin/bash<br>
export LC_ALL=C</strong><br>
<br>
<strong>6. we need /dev ;-)</strong><br>
cd /dev &amp;&amp; ./MAKEDEV generic<br>
<br>
<strong>7. configure apt, install some bytes</strong><br>
edit /etc/apt/sources.list like the following<br>
<strong>deb http://your.local.mirr.or/debian etch main contrib non-free<br>
deb-src http://your.local.mirr.or/debian etch main contrib non-free<br>
<br>
deb http://your.local.mirr.or/security etch/updates main contrib non-free<br>
deb-src http://your.local.mirr.or/security etch/updates main contrib non-free</strong><br>
<br>
<strong>apt-get update<br>
apt-get install locales<br>
dpkg-reconfigure locales<br>
dpkg-reconfigure debconf<br>
dpkg-reconfigure passwd<br>
apt-get install grub linux-image-2.6.18-4-686 libc6-i686 less</strong><br>
<br>
<strong>8. install grub (or lilo if you wish)</strong><br>
<strong>mount /dev/hda1 /boot<br>
grub-install /dev/hda<br>
update-grub</strong><br>
<br>
<strong>9. we should mount something after boot</strong><br>
$EDITOR /etc/fstab:<br>
<strong>proc            /proc           proc    defaults        0       0<br>
/dev/hda2       /               ext3    noatime,errors=remount-ro       0       1<br>
/dev/hda1       /boot           ext3    noatime,errors=remount-ro       0       1<br>
/dev/hda3       none            swap    sw      0       0</strong><br>
<br>
<strong>10. who needs network?</strong><br>
the system should be bootable now, but you still need ssh and a propperly set-up network<br>
<strong>apt-get install openssh-server</strong>, and<br>
<br>
$EDITOR /etc/network/interfaces<br>
<strong>auto lo eth0<br>
iface lo inet loopback<br>
iface eth0 inet dhcp</strong><br>
(usualy you will want to use static instead of dhcp here, but qemu has a nice dhcpd built-in)<br>
<br>
<strong>You're ready, reboot and have fun with your box -&gt; if it won't work, back to rescue mode and happy debugging!</strong></p></body></html>