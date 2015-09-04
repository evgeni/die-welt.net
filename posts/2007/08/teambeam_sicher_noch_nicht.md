<html><body><strong><em>Hinweis</em>: Dieser Artikel ist aus dem Jahr 2007 und spiegelt die Situation zum Zeitpunkt des Verfassens wieder. Meines Wissens nach (und wie <a href="http://www.die-welt.net/2007/08/teambeam_sicher_noch_nicht/#comment-95">Tom von TeamBeam auch kommentiert</a>) wurden alle hier beschriebenen Probleme kurz nach der Veröffentlichung behoben. Der Artikel spiegelt <em>nicht</em> die heutige Situation wieder!</strong>

Wie Bernd Eckenfels mir in einem Kommentar zu meinen Posts über TeamBeam schrieb, hat er <a href="http://itblog.eckenfels.net/archives/269-Review-Team-Beam.html" target="_blank">eine kleine Sicherheitsanalyse</a> gemacht. Dabei kam er zu einem ähnlichen Ergebnis wie ich: TeamBeam behandelt SSL-Zertifikate nicht richtig. So kann man dem Tool ein beliebiges SSL-Zertifikat (auch ein selbst-signiertes) unterschieben, und das Tool wird die Daten dennoch übertragen. Sowas kann man sehr schnell in eine Man-in-the-Middle Attake verwandeln, aber das beschreibt Bernd schon zu genüge. Angeblich ist das in 1.0.1 behoben, und das ergeben auch erste kurze Tests, es werden aber weitere folgen.

Desweiteren hat Tom von Skalio in meiner Abwesenheit den XSS Bug "behoben".

In der Tat werden mittlerweile auch im Adressbuch alle &lt;blah&gt; Einträge rausgefiltert. Wobei ich sagen muss, dass Filtern meiner Meinung nach nicht das richtige Mittel ist - manchmal will man wirklich etwas in &lt; und &gt; schreiben... Ebenso werden solche Einträge bei my.TeamBeam.de gefiltert. Die Alten sind aber noch da, sprich ich kann meine bereits erstellten Hacks weiter nutzen.

Ich hätte das ja ganz anders gelöst: ich hätte den User alles eintragen was er will (auch in der Nachricht) und dann beim verarbeiten der Daten PHPs htmlspecialchars() oder eine ähnliche Funktion die &lt;, &gt; und ein paar andere Zeichen durch die entsprechenden Entities ersetzt aufgerufen und erst die so bearbeiteten Daten an den Empfänger zugestellt.

Client-Security existiert nicht Jungs... Wenn ich 1.0 nehme, den SSL-Traffic sniffe und schaue wie euer Tool funktioniert (Bernd sagt, es sei normales WebDAV, was Sinn macht), dann bau ich mir meine XSS selber rein, ohne euren Client...

So long,

Evgeni</body></html>