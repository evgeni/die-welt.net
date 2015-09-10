<html><body><p>Meine Fresse kann Software manchmal pingelig sein.<br>
<br>
Heute geht es um Courier, die tolle Mail-Software. Genauer gesagt um den MTA davon.<br>
Hab nämlich hier für n Kumpel ne Mail-Addy eingerichtet, weil er IMAP mit ein wenig mehr Space brauchte, und er hat seine alte Adresse auf die neue Weitergeleitet. Sein alter Server ist von Serverschleuder (ein mieser Anbieter) und ist leider bei einigen Spamverzeichnissen gemeldet.<br>
Seit ich gestern ein wenig an meinen DNSBL Listen gedreht hatte, kamen mal wieder keine Mails über Serverschleuder rein und ich dachte mir, ich setz den Server auf die Whitelist, bevor ich wieder das ganze DNSBL rausnehme. Laut Doku von courier geht das ganz einfach. Just "IP allow,BLOCK" in /etc/courier/smtpaccess/default eintragen und makesmtpaccess ausführen. Gesagt, getan, funktioniert nicht.<br>
So saß ich jetzt den halben Tag, hab rumgefrickelt und Leute genervt, die was wissen könnten. Pustekuchen. Ging auf jeden Fall nicht.<br>
Und dann plötzlich Geistesblitz! *tipp* TADA! Geht.<br>
<br>
Und was war? Courier erwartet zwischen IP und allow genau ein TAB, und ich hatte Space dann n TAB. Auf TAB geändert und schon wird der Server whitelisted.<br>
<br>
Tolle Sache das alles. Hat mich doch gut aufgeregt. Aber jetzt rennts ja und ich kann getrost baden gehen.</p></body></html>