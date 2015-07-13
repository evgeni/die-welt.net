<html><body><strong>preparation:</strong><br>

1. boot Windows<br>

2. use your favorite parition manager and shrink the first partition to 20GB, this should be enough for win<br>

3. put in the Debian Etch Beta 2 netinstall CD and reboot<br>

<br>

<strong>installation:</strong><br>

1. boot Debian Etch Beta 2 netinstall CD<br>

2. use expert modus, because we're cool =)<br>

3. when you get the network-setup window, chose the Broadcom device (it was eth1 here). the other one should be the firewire stuff<br>

4. configure everything as you need, but use testing, the fuckin etch cd does not allow to install unstable directy - so we have to dist-upgrade later<br>

note: eth1 has become eth0 here after a reboot<br>

<br>

<strong>video:</strong><br>

The drivers Xorg 7 delivers just suck, ati and radeon does not work with the x1400, vesa gives only 1024x768 output.<br>

We want 1680x1050, so we need fglrx: <strong>apt-get fglrx-control fglrx-driver fglrx-kernel-source</strong>, and let it build (you should know how!). The fglrx version in Etch is a bit old, so use the one from experimental or from Flavios Git, if you know how ;-)<br>

After the drive is built, you just need to install it with dpkg and put fglrx in your xorg.conf.<br>

<br>

<strong>audio:</strong><br>

Intel Corporation 82801G (ICH7 Family) High Definition Audio Controller, works out-of-the-box with ALSA snd-hda-intel.<br>

<br>

<strong>LAN:</strong><br>

Broadcom Corporation NetXtreme BCM5752M Gigabit Ethernet PCI Express, works out-of-the-box with tg3<br>

note: on kernel 2.6.17 (until 2.6.19-rc5) the network does not work anymore after an ifdown eth0 &amp;&amp; ifup eth0 (you need to reload the tg3 module).<br>

<br>

<strong>WLAN:</strong><br>

Intel Corporation PRO/Wireless 3945ABG Network Connection, Debian Sid and Etch have the needed drivers, so just install them:<br>

<br>

// the lines beginning with % you run as user, the ones with # as root<br>

1. # apt-get install firmware-ipw3945 ipw3945d ipw3945-source<br>

Since we have kernel =&gt; 2.6.18, we don't need out-of-tree ieee80211<br>

2. ipw3945 Modul bauen:<br>

	% cd /usr/src<br>

	% tar jxf ipw3945.tar.bz2<br>

	% cd linux-YOURVERSION<br>

	% fakeroot make-kpkg --added-modules ipw3945 modules-image<br>

	# dpkg -i /usr/src/ipw3945-modules-VERSION.deb<br>

3. # modprobe ipw3945<br>

I've tested WPA-PSK, and it works.<br>

<br>

<strong>firewire:</strong><br>

Texas Instruments Unknown device gets installed out-of-the-box. A Behringer FCA202 gets recognized, but lacks Linux drivers for real testing.<br>

<br>

<strong>cardreader:</strong><br>

Texas Instruments Unknown device - works with the tifm_sd and mmc_block modules from 2.6.19. You can find the card under /dev/mmcblk01* and read from it. On writing the driver dies for me :(<br>

<br>

<strong>modem:</strong><br>

Who needs a modem today? Me not - so not tested.<br>

<br>

<strong>fingerprintreader:</strong><br>

Works with some hacks from <a href="http://thinkwiki.org/wiki/How_to_enable_the_fingerprint_reader">http://thinkwiki.org/wiki/How_to_enable_the_fingerprint_reader</a>.<br>

There is also an opensource project out there: <a href="http://thinkfinger.sf.net" target="_blank">ThinkFinger</a>, not tested yet, but looks very nice.<br>

<br>

<strong>IrDA:</strong><br>

gets installed out-of-the-box, tested with LIRC, works.<br>

<br>

<strong>PCMCIA:</strong><br>

gets installed out-of-the-box and my Netgear WG511T works perfectly.<br>

<br>

<strong>HDAPS:</strong><br>

hdaps.c in the kernel (2.6.16.25) is like good crap - just does not work with the Z61m, but you can get the one from tp_smapi (<a href="http://www.thinkwiki.org/wiki/Tp_smapi">http://www.thinkwiki.org/wiki/Tp_smapi</a>).<br>

Download, untar, <strong>make load HDAPS=1</strong> and <strong>insmod ./hdaps.ko force=1</strong> and hdaps-gl is dancing! Or you can use my Debian packages from <a href="http://debian.die-welt.net">http://debian.die-welt.net</a>. They will be in Sid as soon Etch is released.<br>

<br>

<strong>tpb:</strong><br>

tpb is a program to use the IBM ThinkPad(tm) special keys. You can easily get it over apt and works after the user has been added to the nvram group. So you do a <strong>apt-get install tpb</strong>, then a  <strong>adduser zhenech nvram</strong> and relogin into X. After the start of the tool you see nice xosd infos about the volume, display brightness, etc.<br>

<br>

<strong>suspend-to-disk:</strong><br>

Both, <strong>suspend2</strong> and SOFTWARE_SUSPEND from the vanilla kernel 2.6.19 are working great. Since 2.6.19 you don't need to turn AHCI off anymore.<br>

<br>

<strong>suspend-to-ram:</strong><br>

Works too, you just need to boot with <strong>acpi_sleep=s3_bios,s3_mode</strong>.<br>

<br>

<strong>lspci output:</strong><br>

00:00.0 Host bridge: Intel Corporation Mobile 945GM/PM/GMS/940GML and 945GT Express Memory Controller Hub (rev 03)<br>

00:01.0 PCI bridge: Intel Corporation Mobile 945GM/PM/GMS/940GML and 945GT Express PCI Express Root Port (rev 03)<br>

00:1b.0 Audio device: Intel Corporation 82801G (ICH7 Family) High Definition Audio Controller (rev 02)<br>

00:1c.0 PCI bridge: Intel Corporation 82801G (ICH7 Family) PCI Express Port 1 (rev 02)<br>

00:1c.1 PCI bridge: Intel Corporation 82801G (ICH7 Family) PCI Express Port 2 (rev 02)<br>

00:1c.2 PCI bridge: Intel Corporation 82801G (ICH7 Family) PCI Express Port 3 (rev 02)<br>

00:1c.3 PCI bridge: Intel Corporation 82801G (ICH7 Family) PCI Express Port 4 (rev 02)<br>

00:1d.0 USB Controller: Intel Corporation 82801G (ICH7 Family) USB UHCI #1 (rev 02)<br>

00:1d.1 USB Controller: Intel Corporation 82801G (ICH7 Family) USB UHCI #2 (rev 02)<br>

00:1d.2 USB Controller: Intel Corporation 82801G (ICH7 Family) USB UHCI #3 (rev 02)<br>

00:1d.3 USB Controller: Intel Corporation 82801G (ICH7 Family) USB UHCI #4 (rev 02)<br>

00:1d.7 USB Controller: Intel Corporation 82801G (ICH7 Family) USB2 EHCI Controller (rev 02)<br>

00:1e.0 PCI bridge: Intel Corporation 82801 Mobile PCI Bridge (rev e2)<br>

00:1f.0 ISA bridge: Intel Corporation 82801GBM (ICH7-M) LPC Interface Bridge (rev 02)<br>

00:1f.1 IDE interface: Intel Corporation 82801G (ICH7 Family) IDE Controller (rev 02)<br>

00:1f.2 SATA controller: Intel Corporation 82801GBM/GHM (ICH7 Family) Serial ATA Storage Controller AHCI (rev 02)<br>

00:1f.3 SMBus: Intel Corporation 82801G (ICH7 Family) SMBus Controller (rev 02)<br>

01:00.0 VGA compatible controller: ATI Technologies Inc Radeon Mobility X1400<br>

02:00.0 Ethernet controller: Broadcom Corporation NetXtreme BCM5752M Gigabit Ethernet PCI Express (rev 02)<br>

03:00.0 Network controller: Intel Corporation PRO/Wireless 3945ABG Network Connection (rev 02)<br>

15:00.0 CardBus bridge: Texas Instruments PCIxx12 Cardbus Controller<br>

15:00.1 FireWire (IEEE 1394): Texas Instruments PCIxx12 OHCI Compliant IEEE 1394 Host Controller<br>

15:00.2 Mass storage controller: Texas Instruments 5-in-1 Multimedia Card Reader (SD/MMC/MS/MS PRO/xD)<br>

15:00.3 Generic system peripheral [0805]: Texas Instruments PCIxx12 SDA Standard Compliant SD Host Controller<br>

<br>

<strong>attachments:</strong><br>

<a href="http://files.die-welt.net/z61m/xorg.conf" target="_blank">xorg.conf</a><br>

<a href="http://files.die-welt.net/z61m/kernel/config-2.6.19.2-z61m-1" target="_blank">config-2.6.19.2-z61m-1</a><br>

<a href="http://files.die-welt.net/z61m/kernel/linux-image-2.6.19.2-z61m-1_2.6.19.2-z61m-1-10.00.Custom_i386.deb" target="_blank">linux-image-2.6.19.2-z61m-1</a><br>

<a href="http://files.die-welt.net/z61m/kernel/" target="_blank">other kernelmoduls and stuff</a></body></html>