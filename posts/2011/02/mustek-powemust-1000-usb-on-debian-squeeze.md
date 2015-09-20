<html><body><p>Some (long) time ago, I wrote an article <a href="/2006/09/mustek_powemust_1000_usb_unter_debian_sarge/">how to setup a Mustek PowerMust 1000 USB on Debian Sarge</a>. Since then Etch, Lenny and now Squeeze were released and the machine the UPS was attached to was replaced.

Yesterday I have upgraded this machine from Lenny to Squeeze and of course <a href="http://packages.debian.org/nut">nut</a> has kicked me in the nuts, telling me it can't connect to the UPS.

When I replaced the old machine, I had to connect the UPS via USB instead of serial, as the new machine has only one serial port and that one is needed for the serial console to my Sun Netra T1. On Lenny, I was using the <code>megatec_usb</code> driver which seems borked on Squeeze and is superseeded by the <code>blazer_usb</code> one. So here is my <code>nut</code> setup on Squeeze:

<strong>nut.conf:</strong>

</p><pre>MODE=standalone
UPSD_OPTIONS=""
UPSMON_OPTIONS=""</pre>

<strong>ups.conf:</strong>

<pre>[powermust]
    driver = blazer_usb
    port = schrank
    vendorid = 0665
    productid = 5161
    desc = "Mustek PowerMust 1000"</pre>

<em>Yes, <code>port</code> has to be set, but can be any random string.</em>

<strong>upsd.conf:</strong>

<pre>ACL all 0.0.0.0/0
ACL localhost 127.0.0.1/32
ACCEPT localhost
REJECT all</pre>

<strong>upsmon.conf:</strong>

<pre>RUN_AS_USER nut
MONITOR powermust@localhost 1 nut nut master
MINSUPPLIES 1
SHUTDOWNCMD "/sbin/shutdown -h +0"
POLLFREQ 5
POLLFREQALERT 5
HOSTSYNC 15
DEADTIME 15
POWERDOWNFLAG /etc/killpower
RBWARNTIME 43200
NOCOMMWARNTIME 300
FINALDELAY 5</pre>

<strong>upssched.conf:</strong>

<pre>CMDSCRIPT /upssched-cmd</pre>

I hope this helps someone ;)</body></html>
