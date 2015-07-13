<html><body><p>Wer hätte das gedacht? ;-)<br>

<br>

Ich habe gerade meine Festplatte etwas aufgeräumt, und unter anderem die Windows Partition ein wenig verkleinert. War soweit auch alles okay, aber fdisk unter Linux beschwerte sich, Partition würde nicht aufm Zylinder enden: "Partition 1 does not end on cylinder boundary". Kein Problem, dacht ich mir, löschst du sie, und erstellst neu, Daten gehen ja nicht verloren.<br>

<br>

Also fdisk /dev/sda<br>

u<br>

p<br>

Größe der Partiton notieren<br>

n<br>

p<br>

1<br>

63<br>

&lt;notierte Größe&gt;<br>

t<br>

7 (fuer NTFS)<br>

q<br>

<br>

UPS! w für write vergessen. NOCHMAL!<br>

fdisk /dev/sda<br>

u<br>

p<br>

Größe der Partiton notieren<br>

n<br>

p<br>

1<br>

63<br>

&lt;notierte Größe&gt;<br>

w<br>

q<br>

<br>

Mal schauen obs geht, *reboot*. Bluescreen nach dem Bootlogo, Super-Sache. Also Linux gebootet, kann das NTFS ohne Probleme mounten, lesen. Naja, probierst du mal vonner WindowsCD zu reparieren. Aber zuerst /home sichern, man weiß ja nie was so eine WindowsCD macht, wenn sie eine verschlüsselte Linux-Partition entdeckt. rsync, 44GB Daten *schnarch* *wart*<br>

Okay, fertig, reboot.<br>

<br>

STOP! Was steht da in der Konsole? /dev/sda1 Type:Linux ??? Na scheiße. fdisk /dev/sda, t, 7, w, q, init 6 -&gt; Windows bootet. Na toll, wegen 2 Zeichen hab ich jetzt hier 44GB Daten mit 3-4MB/s durch die Gegend geschoben?! FUCK!<br>

<br>

Deswegen sollte man nie nie nie Windows benutzen, macht nur Stress. :(</p></body></html>