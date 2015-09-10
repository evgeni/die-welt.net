<html><body><strong>Vorbeireitung:</strong><br>
1. Windows booten<br>
2. Paragon Partition Manager 7 instalieren<br>
3. Windows-Partition auf 20GB verkleinern, das sollte für evtl Ausflüge zum anderen Ufer reichen<br>
4. Debian Etch Beta 2 netinstall CD einlegen und Reboot<br>
<br>
<strong>Installation:</strong><br>
1. Debian Etch Beta 2 netinstall CD booten<br>
2. expert Modus, ohne weitere Parameter<br>
3. bei Netzwerkeinrichtung eth1 (Broadcom) als Standard auswählen - eth0 scheint Firewire zu sein<br>
4. alles einrichten wie man mag, aber nicht unstable wählen, geht mit der CD nicht. also erst testing, dann dist-upgrade<br>
Anmerkung: nach dem Reboot ist eth0 das gewünschte Netzinterface, doofes rumgehopse<br>
<br>
<strong>Video:</strong><br>
Standardmäßig gibts unter Xorg 7 drei Treiber für ATI Karten: ati, radeon und vesa. Mit den ersten beiden funktioniert die Radeon x1400 nicht, mit vesa gibts nur 1024x768, aber immerhin GUI.<br>
Für echte 1680x1050 braucht mach fglrx, also <strong>apt-get fglrx-control fglrx-driver fglrx-kernel-source</strong>, und bauen. Am besten nimmt man die Version aus experimental oder gar aus Flavios Git, wenn man weiß, wie man damit umegehn soll.<br>
Dann nur noch fglrx in die xorg.conf eintragen, und es läuft wie geschmiert.<br>
<br>
<strong>Audio:</strong><br>
Intel Corporation 82801G (ICH7 Family) High Definition Audio Controller, rennt out-of-the-box mit ALSA snd-hda-intel.<br>
<br>
<strong>LAN:</strong><br>
Broadcom Corporation NetXtreme BCM5752M Gigabit Ethernet PCI Express, rennt out-of-the-box mit tg3<br>
Anmerkung: bei 2.6.17 funktioniert das Netzwerk nach einem ifdown eth0 &amp;&amp; ifup eth0 nicht mehr, unter 2.6.16 gehts und ab 2.6.19-rc5 wieder, da ich eh immer eigene Kernel baue, rennt hier 2.6.19.2 (deb und config gibts unten).<br>
<br>
<strong>WLAN:</strong><br>
Intel Corporation PRO/Wireless 3945ABG Network Connection, die Pakete sind mittlerweile komplett in Sid und auch in Etch, man muss also nicht mehr händisch die Source-Files saugen und kompilieren.<br>
<br>
// alle Zeilen die mit % anfangen als User, die mit # als root ausführen<br>
1. # apt-get install firmware-ipw3945 ipw3945d ipw3945-source<br>
Da wir einen Kernel =&gt;2.6.18 haben, brauchen wir ieee80211 nicht einzelnd zu bauen.<br>
2. ipw3945 Modul bauen:<br>
	% cd /usr/src<br>
	% tar jxf ipw3945.tar.bz2<br>
	% cd linux-EUREVERSION<br>
	% fakeroot make-kpkg --added-modules ipw3945 modules-image<br>
	# dpkg -i /usr/src/ipw3945-modules-VERSION.deb<br>
3. # modprobe ipw3945<br>
Es sollte nun ein Interface vorhanden sein, und auch funktionieren ;-)<br>
WPA-PSK geht hier wunderbar, WPA2 hab ich nicht getestet.<br>
<br>
<strong>Firewire:</strong><br>
Texas Instruments Unknown device wird out-of-the-box erkannt, hab mit einem Behringer FCA202 ausprobiert, Gerät wird erkannt, aber von Behringer gibt es natürlich keine Treiber.<br>
<br>
<strong>Karten-Leser:</strong><br>
Mass storage controller: Texas Instruments 5-in-1 Multimedia Card Reader (SD/MMC/MS/MS PRO/xD) funktioniert mit tifm_sd und mmc_block für SD-Karten, die anderen funktionieren noch nicht.<br>
Irgendwie kann ich zwar von SD super lesen, beim schreiben verabschiedet sich der Treiber aber... *grml*<br>
Wenn man die Module geladen hat und eine Karte einsteckt, findet man diese unter /dev/mmcblk*<br>
<br>
<strong>Modem:</strong><br>
Kein Bedarf hier, deswegen nicht getestet<br>
<br>
<strong>Fingerprintreader:</strong><br>
Funktioniert mit ein bisschen Hacken via <a href="http://thinkwiki.org/wiki/How_to_enable_the_fingerprint_reader">http://thinkwiki.org/wiki/How_to_enable_the_fingerprint_reader</a>.<br>
Mittlerweile gibt es auch ein OpenSource Projekt: <a href="http://thinkfinger.sf.net" target="_blank">ThinkFinger</a>, welches ich aber noch nicht getestet habe, da es noch keine Debian Pakete gibt. Sieht aber vielversprechend aus.<br>
<br>
<strong>IrDA:</strong><br>
Wird out-of-the-box erkannt, habs auch kurz mit LIRC getestet und es ging. Für mehr hab ich kein Bedarf.<br>
<br>
<strong>PCMCIA:</strong><br>
Wird out-of-the-box erkannt, und meine Netgear WG511T funktioniert tadellos.<br>
<br>
<strong>HDAPS:</strong><br>
Das hdaps.c aus dem Kernel (2.6.16.25) ist fürn Arsch - funktioniert nicht mit dem Z61m, allerdings das von tp_smapi (<a href="http://www.thinkwiki.org/wiki/Tp_smapi">http://www.thinkwiki.org/wiki/Tp_smapi</a>).<br>
Dafuer hab ich mittlerweile Debian Pakete gebaut, die auch funktionieren, sobald =&gt;2.6.19 in Debian ist, werde ich diese hochladen. Asonsten kriegt man die Pakete auch auf <a href="http://debian.die-welt.net">http://debian.die-welt.net</a>.<br>
<br>
<strong>tpb:</strong><br>
tpb ist ein Programm, um die "Special-Keys" von ThinkPads zu nutzen. Es ist über apt verfügbar und funktioniert sofern der User in der Gruppe nvram drin ist. Nach einem <strong>apt-get install tpb</strong>, gefolgt von einem <strong>adduser zhenech nvram</strong> und einem neueinloggen in X wird mit xosd zB das verändern der Lautstärke und ähnliches angezeigt. Eigentlich sehr nützlich.<br>
<br>
<strong>suspend-to-disk:</strong><br>
Sowohl <strong>suspend2</strong> als auch SOFTWARE_SUSPEND aus dem Kernel funktionieren mit Kernel 2.6.19 wunderbar. Man muss auch nicht mer AHCI ausschalten.<br>
<br>
<strong>suspend-to-ram:</strong><br>
Funktioniert auch einwandfrei wenn man <strong>acpi_sleep=s3_bios,s3_mode</strong> zu den Boot Parametern hinzufügt.<br>
<br>
<strong>Ausgabe von lspci:</strong><br>
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
<strong>Anhang:</strong><br>
<a href="http://files.die-welt.net/z61m/xorg.conf" target="_blank">xorg.conf</a><br>
<a href="http://files.die-welt.net/z61m/kernel/config-2.6.19.2-z61m-1" target="_blank">config-2.6.19.2-z61m-1</a><br>
<a href="http://files.die-welt.net/z61m/kernel/linux-image-2.6.19.2-z61m-1_2.6.19.2-z61m-1-10.00.Custom_i386.deb" target="_blank">linux-image-2.6.19.2-z61m-1</a><br>
<a href="http://files.die-welt.net/z61m/kernel/" target="_blank">andere kernelmodule etc</a></body></html>