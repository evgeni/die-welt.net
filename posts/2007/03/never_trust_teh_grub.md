<html><body><p>Ich habe mich heute entschlossen, auf meinem ThinkPad mal Mac OS X x86 zu installieren. Da meine interne Platte schon recht dicht partitioniert ist und ich keinen Schaden anrichten wollte, sollte das Ganze auf eine per USB angeschlossene 20GB Platte fließen. Wie man aus dem ThinkPad ein iPad (oder ThinkBook, oder PowerPad, oder [wieauchimmer]) macht, werde ich an dieser Stelle nicht erläutern (vielleicht später, aber es war wirklich einfach), aber ich wollte von einer anderen Begegnung berichten.<br>

<br>

Auf dem ThinkPad hab ich hier eigentlich ein Dual-Boot aus Windows XP Pro und Debian GNU/Linux (eigentlich ein Tripple-Boot, denn da ist ja noch das IBM-Rescue Zeug drauf, das ich bei Gelegenheit mal löschen könnte). Wie so oft kommt als BootManager GRUB zum Einsatz. Naja, auf jeden Fall hab ich im BIOS als Boot-Reihenfolge DVD-&gt;USB-&gt;HDD eingestellt, Mac OS X installiert und konnte es auch ohne Probleme von USB booten. Mac OS X ist ja auch sehr hybsch und so, aber ich wollte dann doch mal wieder an mein geliebtes Debian, fahre also Mac OS X runter, stöpsel die USB-Festplatte ab und boote...<br>

<br>

GRUB<br>

Stage 1.5<br>

Error 17<br>

<br>

WTF!? Hat OS X da etwa meine interne Festplatte angepackt, obwohl er nicht sollte? Schnell zum GRML-USB-Stick gegriffen, eingestöpselt, gebootet. sda3 (meine /-Partition) ist da, fsck bringt keine Fehler und mount mounted ohne Murren. Daten sind natürlich auch noch alle da (okay, man sollte nach einem mount /mnt/sda3 nicht ls /mnt/sda6 tippen und sich in die Hose machen, warum das leer ist). Also mal /proc und /dev gemountet, chroot, und grub neu installiert, menu.lst neugeschrieben und Reboot.<br>

<br>

Error 17<br>

<br>

Hatten wir doch gerade schon, also wieder GRML rein, nochmal alles prüfen, sieht okay aus. Dennoch nochmal GRUB neuinstalliert und mal nochmal booten, wenns nicht hilft Backup einspielen, wozu sind die Dinger sonst da.<br>

Naja, als ich dann von GRML aufgefordert werde die CD ausm Laufwerk zu nehmen (ich ziehe stattdessen den USB-Stick), merke ich, dass hinten ja noch ein USB-Stick steckt. Mein normaler Stick, 2GB von Saturn, mit Daten etc. Ziehste ma auch raus, denk ich mir. Reboot.<br>

<br>

GRUB 0.97 foobar... ES RENNT.<br>

<br>

USB-Stick rein, Reboot, Error 17.<br>

<br>

USB-Stick raus, Reboot, OK.<br>

<br>

Was lernen wir daraus? Wenn im BIOS Boot von USB aktiviert ist, scheint GRUB den USB-Stick als hd0 zu sehen. Komischerweise aber nur, wenn er direkt geladen wird, und nicht aus einem Linux heraus.</p></body></html>