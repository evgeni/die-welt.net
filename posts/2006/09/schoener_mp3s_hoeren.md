<html><body><p>Heute ist mpd 0.12 endlich in Debian unstable angekommen.<br>

Die wichtigste (für mich) Neuerung dieses Releases ist der IceCast Output. Der MPD kann jetzt also statt direkt an ALSA o.ä. den Sound abzuliefern, den an IceCast geben, der diesen dann streamt.<br>

Hat den Vorteil, dass der MPD und IceCast bei mir aufm Router laufen können, wo die ganze Musik-Sammlung liegt, und ich einfach mit dem grade verfügbaren Client verbinde und höre. Egal ob ich grade aufm Balkon, in meinem Zimmer oder in der Uni sitze.<br>

Ein Hacken hat die Sache aber - auf dem Router ist Sarge, und da gibts nur mpd 0.11.irgendwas. Hab mich also mal rangesetzt und Backports gebaut. Das MPC Feature musste fliegen, da unter Sarge die benötogten Libs nicht vorhanden sind. Ansonsten ist das Paket mit dem in Sid identisch.<br>

Zu bekommen unter:<br>

deb http://debian.die-welt.net/ sarge main<br>

deb-src http://debian.die-welt.net/ sarge main<br>

<br>

Zu Konfiguration ist folgendes zu sagen:<br>

IceCast mit 'apt-get install icecast2' installieren, in der /etc/icecast2/icecast.xml die Passwörter einstellen und in der /etc/default/icecast 'ENABLE=true' setzen mehr ist nicht nötig. Doch, /etc/init.d/icecast2 start ;-)<br>

Dann apt-get install mpd, und nicht wundern, dass er nicht startet - er hat ne recht leere config und versucht deswegen standardmäßig auf ALSA auszugeben. Zuerst erstellt man in /var/lib/mpd/music Symlinks zu seinen Musik-Verzeichnissen, dann editiert man die /etc/mpd.conf. Dort muss man nur die folgende Section auskommentieren:<br>

audio_output {<br>

        type            "shout"<br>

        name            "my cool stream"<br>

        host            "localhost"<br>

        port            "8000"<br>

        mount           "/mpd.ogg"<br>

        password        "password"<br>

        quality         "5.0"<br>

        format          "44100:16:1"<br>

        user            "source"<br>

        description     "here's my long descriptiion"<br>

}<br>

und natürlich das Passwort zu dem bei IceCast eingestelltem ändern. /etc/init.d/mpd start und es läuft.<br>

<br>

Jetzt will man natürlich den Sound von überall kontrollieren können, also holt man sich von <a href="http://www.musicpd.org/phpMp.shtml">http://www.musicpd.org/phpMp.shtml</a> das phpMp deb: <a href="http://mercury.chem.pitt.edu/~shank/phpmp_0.11.0-1_all.deb">http://mercury.chem.pitt.edu/~shank/phpmp_0.11.0-1_all.deb</a>. /etc/phpmp.conf.php editieren (Host und Port vom MPD eintragen). /etc/apache/conf.d/phpmp.conf editieren und folgendes eintragen:<br>

        Order deny,allow<br>

        Deny from all<br>

        Allow from 192.168.13.0/255.255.255.0<br>

        Allow from 192.168.23.0/255.255.255.0<br>

        Allow from 127.0.0.1<br>

(statt den vorhandenen Order, Allow und Deny Zeilen - so kommt man nur ausm lokalen Netz auf den phpMp, nicht dass ein boehser Mann von außen die Musik verstellt). Ein herzliches /etc/init.d/apache force-reload und man kann unter http://router/phpmp den MPD steuern (erstmal DB updaten lassen) und unter http://router:8000/mpd.ogg den Stream hören.<br>

<br>

Viel Spaß</p></body></html>