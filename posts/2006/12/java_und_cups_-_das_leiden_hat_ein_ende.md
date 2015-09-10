<html><body><p>Ich war es leid, dass ich trotz aktuellem Java und CUPS auf meinem Debian Sid immer noch nicht aus Java heraus drucken konnte. Java meinte einfach die ganze Zeit "es werden keine Jobs angenommen" von meinem Drucker.<br>
Zunächst hieß es, es ist ein Bug in Java und der kann nicht auf Drucker mit Sonderzeichen im Namen drucken, aber mein HPLJ4000N hat KEINE Sonderzeichen im Namen.<br>
<br>
Dann stieß ich beim <a href="http://www.fedorablog.de">FedoraBlog</a> auf einen <a href="http://www.fedorablog.de/archives/104-Java-druckt-nicht-mehr-auf-Fedora.html">Artikel, dass Java auch unter Fedora nicht druckt</a> man als Würgaround aber auf CUPS 1.2.1 downgraden könnte. Fand ich eigentlich nicht so pralle die Lösung, vorallem weil hier mittlerweile CUPS 1.2.7 rennt.<br>
<br>
Aber dann kam die Erlösung tief im BTS von Sun: <a href="http://bugs.sun.com/bugdatabase/view_bug.do?bug_id=6500903">Bug Nummer 6500903</a> mit einem "einfachem" Würgaround:<br>
# ln -s /usr/lib/libcups.so.2 /usr/lib/libcups.so<br>
$ CUPS_SERVER=localhost java ...<br>
<br>
Nach Schritt 1 funktioniert das Drucken in Java gänzlich nicht mehr, er findet keinen Druck-Service, aber nachdem man seine Java Anwendung mit der Environment-Variable CUPS_SERVER auf localhost gestartet hat, nehmen die Drucker plötzlich Aufträge entgegen.<br>
<br>
Bis jetzt habe ich auch keine Nebenwirkungen bei anderen Programmen durch den Link in /usr/lib/libcups.so feststellen können, deswegen kann ich damit leben und kann nun endlich direkt aus BlueJ meinen Code ausdrucken, ohne ihn zuerst in GVim kopieren zu müssen.<br>
<br>
<strong>UPDATE:</strong><br>
Auf <a href="http://www.fedorablog.de/archives/165-Workaround-fuer-CUPS-unter-Java.html">fedorablog.de</a> hab ich einen weiteren Würgaround gefunden, der mir sogar besser gefällt.<br>
Statt CUPS_SERVER an Java mitzugeben, kann man auch einfach das<br>
Listen /var/run/cups/cups.sock<br>
in der /etc/cups/cupsd.conf auskommentieren, damit CUPS nur noch auf localhost:631 und nicht mehr auf dem Socket lauscht. Et Voila - es druckt.</p></body></html>