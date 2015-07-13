<html><body><p>Da ich ja jetzt Student bin, hab ich in den Vorlesungen und zwischendurch immer mal wieder Zeit, und diese lässt sich mit old-school Killerspielen a la Unreal Tournament am besten totschlagen.<br>

Dafür hab ich mir bei real für 10€ Unreal Tournament 2004 aus der Software Pyramide gekauft und wollte es unter Linux spielen. Ja unter Linux, UT2004 läuft nativ, ohne dumme Hacks mit WINE, Cedega und Co.<br>

<br>

Im Internet gibt es eine Anlaufstelle für Spiele unter Linux: HOLARSE. Da hab ich auch ein <a href="http://www.holarse-linuxgaming.de/h2006/space/Unreal+Tournament+2004" target="_new">Tutorial für UT2004</a> gefunden und fasse es hier ein wenig zusammen.<br>

Mein System ist Debian Sid auf einem i386, aber UT2004 sollte auch auf amd64 problemlos laufen. Leider waren die Jungs von der Software Pyramide so nett, und haben den Linux Installer von der DVD gelöscht, so dass man etwas Hand anlegen muss:<br>

<br>

(Anm: Zeilen mit # vorne sind als root auszuführen, die mit $ als normaler User)<br>

<br>

Zunächst brauchen wir unshield zum entpacken von UT, und zwei Bibliotheken (die sind erst später wichtig):<br>

<strong># apt-get install unshield libopenal0a libsdl1.2debian-alsa</strong><br>

<br>

Jetzt noch den Linux Patch auf die aktuellste Version:<br>

<strong>$ wget ftp://holarse-linuxgaming.de/patches/UT2004/ut2004-lnxpatch3369-2.tar.bz2</strong><br>

<br>

Nun erstellen wir einen Ordner und kopieren den Inhalt der DVD dahin:<br>

<strong>$ mkdir ut2k4_cabs<br>

$ cd ut2k4_cabs<br>

$ mount /media/dvd<br>

$ cp /media/dvd/Disk*/data* .</strong><br>

<br>

Jetzt wird das ganze mit unshield nach ~/bin/ut-2004 entpackt:<br>

<strong>$ unshield -d ~/bin/ut-2004 x ~/ut2k2_cabs/data1.cab</strong><br>

<br>

Wir haben das Spiel ja gekauft, also haben wir auch einen CD-Key, dieser wird in Großbuchstaben in die Datei ~/bin/ut-2004/System/cdkey eingetragen:<br>

<strong>$ $EDITOR ~/bin/ut-2004/System/cdkey</strong><br>

<br>

Noch den Patch einspielen:<br>

<strong>$ cd ~/bin/ut2004/<br>

$ tar jxf ~/ut2004-lnxpatch3369-2.tar.bz2<br>

$ cp -a UT2004-Patch/* .<br>

$ rm -rf UT2004-Patch/</strong><br>

<br>

Eigentlich könnte man jetzt spielen, aber UT meckert, es fehlen Bibliotheken (die wir vorhin installiert haben).<br>

Also erstellen wir Symlinks im System Ordner von UT:<br>

<strong>$ ln -s /usr/lib/libSDL-1.2.so.0 ~/bin/ut-2004/System/libSDL-1.2.so.0<br>

$ ln -s /usr/lib/libopenal.so.0 ~/bin/ut-2004/System/openal.so</strong><br>

<br>

Jetzt könnte man spielen, aber ich will noch ein Script haben, um UT schnellre starten zu können.<br>

<strong>$ $EDITOR ~/bin/ut2004</strong><br>

und folgendes eintragen:<br>

<br>

<strong>#!/bin/sh<br>

cd ~/bin/ut-2004/System<br>

./ut2004-bin $@</strong>(hier muss am Ende ein ät stehen, dummes anti-spam Script)<br>

<br>

Alternativ muss man in die letze Zeile <strong>./ut2004-bin-linux-amd64 $@</strong> (hier auch ät) schreiben, wenn man AMD64 hat.<br>

<br>

Das Script ausführbar machen:<br>

<strong>$ chmod +x ~/bin/ut2004</strong><br>

<br>

Wenn man ~/bin in seinem $PATH hat, kann man nun UT mit<br>

<strong>$ ut2004</strong><br>

starten, wenn nicht, muss man etwas mehr tippen:<br>

<strong>$ ~/bin/ut2004</strong><br>

<br>

Unreal Tournament 2004 sollte jetzt laufen und man sollte auch Sound haben. Wenn nicht - nochmal alles lesen, und gucken, was man vergessen hat. Evtl mal auch bei HOLARSE nachschauen.<br>

<br>

Jetzt wollen wir noch etwas Fine-Tuning betreiben:<br>

<strong>$ $EDITOR ~/.ut2004/System/UT2004.ini</strong><br>

<br>

Im Abschnitt <strong>[OpenGLDrv.OpenGLRenderDevice]</strong> <strong>UseRenderTargets=False</strong> suchen und durch <strong>UseRenderTargets=True</strong> ersetzen. Dann noch ganz unten folgendes hinzufügen:<br>

<strong>[UnrealGame.UnrealPawn]<br>

bPlayerShadows=True<br>

bBlopShadow=False</strong><br>

<br>

UT wieder starten und ganz viel Spaß haben!</p></body></html>