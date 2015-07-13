<html><body><p>So, seit gestern ist es soweit, Xorg 7.0 ist in Debian Sid (unstable) angekommen und wurde fröhlich installiert. Natürlich wie immer ohne Probleme (das war gelogen).<br>

<br>

Folgende Punkte gabs/gibts:<br>

<br>

1. nvidia-glx wird wegen einer falschen Abhängigkeit auf xserver-common deinstalliert und X startet nicht mehr mit den nvidia Treibern.<br>

Lösung: apt-get update und die neueste nvidia-glx installieren, da ist das Problem behoben und es sollte funktionieren (kanns grad nicht testen, da nicht zuhause und im Laptop keine NVIDIA Karte, aber auf debianforum.de hieß es, es geht).<br>

<br>

2. Xorg startet, aber es gibt kein Alt Gr, man kann nicht auf virtuelle Terminals umschalten (Ctrl+Alt+FX) und ähnliche Probleme mit der Tastatur. Fehlermeldung im Xorg.0.log: Couldn't load XKB keymap, falling back to pre-XKB keymap<br>

Lösung: apt-get install xkb-data und X neustarten. Anscheinend hat irgend ein Maintainer gepennt, als die Dependencies gesetzt wurden, X ohne XKB ist doof.<br>

<br>

3. Der schöne Cursor ist weg, und man hat nur noch den Standard von X - so einen schwarzen Pfeil.<br>

Lösung: Xcursor.theme: &lt;dein lieblings Theme&gt; in die ~/.Xressources eintragen - ist war n haesslicher Hack, aber es funktioniert erstmal. Mal schauen was mit der alten update-alternatives Methode geworden ist.<br>

<strong>UPDATE:</strong> Schöner gehts mit 'ln -s /usr/share/icons/&lt;deinTheme&gt; /usr/share/icons/default' - allerdings ist das immer noch nicht perfekt<br>

<br>

4. Gibt da noch Kleinigkeiten mit GDM und KDM und so - näheres kann man unter <a href="http://wiki.debian.org/Xorg69To7">http://wiki.debian.org/Xorg69To7</a> nachlesen.<br>

<br>

In diesem Sinne happy Upgrade!</p></body></html>