<html><body><strong><em>Hinweis</em>: Dieser Artikel ist aus dem Jahr 2007 und spiegelt die Situation zum Zeitpunkt des Verfassens wieder. Meines Wissens nach (und wie <a href="/2007/08/teambeam_sicher_noch_nicht/#comment-95">Tom von TeamBeam auch kommentiert</a>) wurden alle hier beschriebenen Probleme kurz nach der Veröffentlichung behoben. Der Artikel spiegelt <em>nicht</em> die heutige Situation wieder!</strong>

Gestern Abend bloggte ich ja bereits meine ersten Ansichten zum Thema TeamBeam.

Gleichzeitig ging auch eine Mail an den Tom von Skalio raus, in der ich auf meinen ersten Artikel und meine weiteren Absichten hingewiesen habe. Das war so kurz nach Mitternacht (also eigentlich sogar schon heute).

Heute (Sonntag!) trudelten gegen 9 Uhr morgens zwei Mails ein. Die eine enthielt Daten für meinen Testzugang, die andere ein paar freundliche (und wirklich persönliche) Worte, plus den Hinweis, dass eine Linux-Version in Mache sei.

Für den Support kriegen die Jungs erstmal einen Pluspunkt, aber was bringt mir der Support, wenn ich die Software gar nicht nutzen will? Naja, erstmal testen.

Die Mail mit den Zugangsdaten enthielt einen Link zur Downloadseite, wo nun endlich "vernünftige" Systemvoraussetzungen stehen: "Windows ME/XP/Vista, Java 1.4.2 oder höher" oder "Mac OS X 10.3 oder höher" - auf 2000 und 2003 läufts nicht? Nachher mal paar Virtuelle Maschinen aufsetzen ;) Aber erstmal schauen was man grade heruntergeladen hat.

<strong>TeamBeam-1.0-Windows.zip</strong> enthällt nur eine TeamBeam.exe, in Wine kanns natürlich nicht gestartet werden, da dort kein Java installiert ist.

<strong>TeamBeam-1.0-Mac.zip</strong> enthällt den Ordner TeamBeam.app, wie er unter MacOS nach /Applications kopiert wird um die Software von da aus zu starten. Netterweise gibts in dieser Version keine komischen Binary-Wrapper, sondern nur pures Java. Also <strong>cd TeamBeam.app/Contents/Resources/Java</strong> und <strong>java -jar SkalioPushClient.jar</strong> - schon hab ich das Ding unter Linux laufen. Naja, zumindest gestartet. Das war ja einfach.

Dann kann ich ja jetzt schon über das Ding maulen, ohne das plöde Vista booten zu müssen.

Der Login-Screen ist klein und funktional, man kann den Server wählen, wo man sich einloggen will, seine Daten eintragen, diese Speichern lassen, einen Proxy konfigurieren und ein vergessenes Passwort anfordern.

Nach einem Klick auf "Einloggen" verschwindet die Maske und man darf ein paar Sekunden warten - hier wäre ein Hinweis-Fenster nach dem Motto "logge ein" nicht verkehrt, ich dachte schon das Tool wär verreckt - bis das Main-Fensterle kommt.

Hier kann man nun die zu sendenden Dateien, nebst Empfänger und Nachricht auswählen. Drag and Drop aus Thunar funktioniert leider nicht, aber das schieb ich jetzt einfach mal auf die Tatsache, das es MacOS Software ist ;)

Über Datei-&gt;Öffnen eine Datei ausgewählt, eine Zeile Text geschrieben und mich selbst als Empfänger ausgewählt. Ein Klick auf "Senden" und das Zeug ist weg - jetzt übrigens mit Statusanzeige etc (das sollte Lob sein :P).

Sekunden später trudelt in meinem Postfach eine Mail ein, um Subject das Wort Dateitansfer, gefolgt von meinem Namen und dem Dateinamen, wirkt sehr übersichtlich. Der Inhalt auch, wäre da nicht die Tatsache mit dem text/plain und text/html - Redundanz muss sein (aber das HTML ist ausnahmsweise halbwegs sinnvoll zur Formatierung verwendet worden, und nicht um einfach da zu sein).

Das Wichtigste in der E-Mail ist der Link: https://files.teambeam.de/get.php?t=&lt;langer Hash der nicht nach MD5 aussieht&gt;. Ich haette es für schön befunden, würd ich den Dateinamen im Link sehen, aber so gehts auch. *klick* Und es lädt eine Seite, die nochmal meinen Namen, meine Nachricht und einen Verweis auf die Datei enthält. Interessanterweise fängt mein Sylpheed an zu blinken - neue E-Mail - von TeamBeam (Jungs, der Absender www-data@teambeam.de sieht doof aus). Ich hätte die Datei abgeholt. Leider nicht. Ich habe zwar die Seite besucht, wo es die Datei gibt, die Datei selbst habe ich aber noch geholt. Immerhin ist die md5sum der Datei noch die selbe, nachdem ich die Datei wirklich geladen habe.

Sieht also alles ganz okay aus bis jetzt, wenn man die falsche Empfangsbestätigung mal außen vor lässt.

Jetzt gibts da aber noch <a href="https://my.teambeam.de/" target="_blank">my.TeamBeam.de</a>, eine Art Portal, wo man seine Gesendeten und Empfangenen "Beams" sieht und das eigene Profil bearbeiten kann. Dort kann man auch die gesendeten Daten nochmal einsehen, löschen oder deren Aufbewarung verlängern. Leider kann man aber dem Empfänger keine zweite Info-Mail schicken, was ich persönlich gerne sehen würde. Ansonsten ist das Ding funktional, wenn auch nicht unbedingt nötig.

Aber zurück zu TeamBeam selbst. Leser dieses Blogs wissen, dass ich nicht nur OpenSource, sondern auch Security-geil bin. Insbesondere was Cross-Site Scripting (XSS) angeht. Und was gibt es schöneres, als eine Software die E-Mails verschickt und dynamische Webseiten anlegt, um ein wenig zu XSS'en.

Der erste Versuch - einfach ein paar HTML-Tags in der Nachricht zu verstecken schlug fehl, diese wurden komplett rausgefiltert (alles was nach &lt;irgendwas&gt; aussah wurde gelöscht). Aber da gibt es ja noch den Empfänger und den Absender.

Das hatte zur Folge, dass einige Mail-Header etwas kaputt aussahen (kleinere Übel) und dass das HTML sauber im Quelltext war, einmal in der E-Mail und dann auch noch in der Aufzurufenden Page (inkl. SSL). Das ist Service Jungs. Wer jetzt schreit, soll das bitte in Ruhe machen, immerhin hab <strong>ICH</strong> nichts für die Software bezahlt.

Leider hab ichs nicht geschafft, ein \n einzuschleusen, um paar neue Mail-Header zu generieren. Aber ich nutz die Software ja auch erst ein paar Stunden.

Das reicht aber auch fürs erste finde ich. Eine Software die nicht unter Linux laufen soll, unter Linux zum Laufen bekommen, einen Bug im Informations-Fluss gefunden und eine nette Sicherheitslücke entdeckt. Eigentlich müsste ich den Jungs von Skalio sagen, ich will gutes Geld für meine Tests. Aber ich glaub ich gebe mich zufrieden, wenn sie meinen Namen im ChangeLog aufführen.

Leider weiß ich immer noch nicht, was für einen großen Vorteil TeamBeam gegenüber von FTP-Upload und HTTP-Download hat, aber vielleicht sagen die Jungs von Skalio mir das noch irgendwann.</body></html>
