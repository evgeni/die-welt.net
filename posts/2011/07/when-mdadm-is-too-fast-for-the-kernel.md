<html><body><p>... you have to put <code>options scsi_mod scan=sync</code> somewhere in <code>/etc/modprobe.d/</code> and regenerate the initrd.

(thanks to Michal Ludvig in <a href="http://lists.debian.org/debian-boot/2010/11/msg00369.html">http://lists.debian.org/debian-boot/2010/11/msg00369.html</a>)



Just happened to me on my Sun Netra T1-200 after the upgrade from Lenny to Squeeze, which threw me back into busybox of the initrd when it could not find the root-fs (on raid) and where <code>mdadm -A /dev/md0</code> worked just fine to confuse me.</p></body></html>