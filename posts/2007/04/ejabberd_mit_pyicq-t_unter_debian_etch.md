<html><body><p>Nachdem die Jungs von <a href="http://blog.teranetworks.de/369/teranetworks-speaks-jabber/" target="_blank">teranetworks</a> nun einen eigenen Jabber-Server haben, dachte ich mir, "das kannst du auch".<br>

<br>

Gesagt getan, kurz im Netz gesurft und ejabberd für besser als jabberd gefunden, aufm Server eingeloggt und <strong>apt-get install ejabberd</strong>. Das zieht erstmal einige erlang Pakete, dann ejabberd und installiert diese. Während der Installation wird man von debconf nett gefragt, wie der Server heißen soll und wer Administrator ist. Schon war der Server online und ich konnte chatten - aber nur mit Leuten die Jabber haben, was leider nicht immer der Fall ist.<br>

<br>

Also musste ein ICQ-Transport her. Ich entschied mich für PyICQ-t, und bereute diese Entscheidung sehr schnell, denn es gab keine Debian Pakete. Aber es ist ja Python, kann also nicht so schwer sein zum Laufen zu bekommen. Kurz das tar.gz von <a href="http://pyicq-t.blathersource.org/">http://pyicq-t.blathersource.org/</a> runterladen, entpacken und schauen was es so an Dependencies hat - twisted, twisted-web und twisted-words. <strong>apt-get install python-twisted python-twisted-web python-twisted-words</strong> ... <i>MOMENT!</i> libgtk?! libglade?! WTF?! Also nochmal gucken. python-twisted ist kein wirkliches Paket, hängt aber von allen Unterpaketen ab. Was brauch ich davon wirklich? Nur python-twisted-web und python-twisted-words, zieht dennoch das ganze GTK und Glade Zeug mit, siehe <a href="http://bugs.debian.org/412684">http://bugs.debian.org/412684</a>. Naja, also:<br>

<strong>apt-get install python-twisted-web python-twisted-words python-crypto python-pyopenssl python-imaging</strong><br>

die letzten drei werden später noch benötigt, sonst rennt PyICQt nicht.<br>

<br>

Jetzt noch kurz die /etc/ejabberd/ejabberd.cfg editieren - ICQ Transport aktivieren.<br>

Ebenso in ~/pyicq-t-0.8/ die config.xml aus dem Beispiel erstellen, ebenso passend konfigurieren und fertig. "python PyICQt.py -b" tippen und das Ding rennt.<br>

<br>

Jetzt habe ich einen eigenen Jabber-Server und ICQ-Transport! Yay!<br>

<br>

Jabbert mir unter sargentd@jabber.die-welt.net</p></body></html>