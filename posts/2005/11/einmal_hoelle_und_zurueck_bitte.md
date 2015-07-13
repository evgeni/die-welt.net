<html><body><p>Ja so in etwa habe ich mich hier grade gefühlt.<br>

Hab hier n FileServer mit Debian GNU/Linux stehen, auf dem die Daten-Partitionen aus Paranoia mit 256Bit AES verschlüsselt sind - soweit ja sogut. Nun wollte ich grade noch eine weitere Parition erstellen. Schön Copy&amp;Paste aus der README.gz, da man ja zu faul zum Tippen ist, Enter gedrückt, und merke: OMFG - der plättet ja grade eine bereits fast volle Partition!!!111einself<br>

Ich schnell ^C, killall -9 dd - war erstma Ruhe. Aber Platte lies sich ned mounten - die ersten paar MB sind dem Schredder zum Opfer gefallen. Und fsck findet natürlich auch keinen Backup-Superblock... Gottseidank ging aber folgendes:<br>

mke2fs -S /dev/loop3<br>

e2fsck /dev/loop3<br>

[warten]<br>

/lost+found aufräumen<br>

tune2fs -j /dev/loop3<br>

<br>

Also hab ich meine Daten erstma wieder - vermisse soweit auch nix.<br>

Aber war echt n Höllentripp wo ich merkte: OHOH - wrong DEV<br>

<br>

In diesem Sinne: gute Nacht!</p></body></html>