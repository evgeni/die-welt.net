<html><body><p>Mjoa, ich hab ja schon seit etwas längerer Zeit hier unter Debian Sid DVB-T mit einer Avermedia AverTV DVB-T 771 am laufen. Allerdings bis heute mit Kaffeine, da mplayer und XINE irgendwie ned so wirklich pralle sind... Und das unter einer GTK2 dominierten Xfce 4.4beta1 Oberfläche...<br>
<br>
Naja, auf jeden Fall fand ich im Endeffekt Kaffeine auch ned ganz so praktisch (man kann keine channels.conf direkt abfüttern und mit LIRC will das Ding auch nicht so wirklich) und wollte VLC haben, den ich eh für DVDs und ähnliches benutze.<br>
<br>
Gesagt - getan, nur wie bedien ich DVB mit VLC? Die Einstellungen würde XINE als 'Master of the known Universe' bezeichnen. Und wenn man ein Kanal drin hat, kann man irgendwie nicht zum nächsten schalten. Aber doch!<br>
<br>
Man muss einfach die vorhandene channels.conf nehmen und sie mit VLC öffnen, schon wird die Playlist übernommen und man kann fröhlich Zappen. Nur gut, dass das nirgends dokumentiert ist.<br>
Und nicht vergessen, deinterlace einzuschalten, sonst siehts doof aus :P<br>
<br>
Um LIRC mit VLC zum laufen zu bringen, muss man in die ~/.vlc/vlcrc folgendes eintragen:<br>
<strong># Control-Interfaces (Text)<br>
control=lirc</strong><br>
(Das geht auch mit der GUI von VLC)<br>
Und dann die ~/.lircrc wie folgt abändern: <a href="http://david.decotigny.free.fr/wiki/wakka.php?wiki=LIRC">http://david.decotigny.free.fr/wiki/wakka.php?wiki=LIRC</a>  (jaja, ist auf Französisch, aber die lircrc ist gut)<br>
<br>
Und hier noch ein paar nützliche Dateien, die den Betrieb von DVB-T in Düsseldorf und dem Ruhrgebiet vereinfachen:<br>
<a href="http://files.die-welt.net/dvbt/dvbt-de-ruhrgebiet">de-Ruhrgebiet </a>(Original von <a href="http://stefans.datenbruch.de/dvb/">http://stefans.datenbruch.de/dvb/</a>, gepatcht wegen den neuen ARD Frequenzen)<br>
<a href="http://files.die-welt.net/dvbt/channels-de-ruhrgebiet.conf">channels.conf</a> für diejenigen, die zufaul sind, selbst zu scannen<br>
<a href="http://files.die-welt.net/dvbt/dvbt-de-ruhrgebiet.m3u">vlc-dvbt.m3u</a> für diejenigen, die zufaul zum Scannen und zum Öffnen einer channels.conf sind</p></body></html>