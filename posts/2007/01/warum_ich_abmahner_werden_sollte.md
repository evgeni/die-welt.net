<html><body><p>Laut Deutschem Gesetzt müssen gewerbliche Webseiten ein Impressum mit gültigen Kontaktdaten haben. Auf meiner ewig währenden Mission die Welt von XSS zu befreien bin ich aber mittlerweile auf 2 Seiten gestoßen wo das nicht der Fall ist.<br>

<br>

1. <a href="http://www.sonybmg.de/company.php?id=41">http://www.sonybmg.de/company.php?id=41</a><br>

Wenn man eine Mail an kontakt@sonybmg.com schickt, kriegt man folgendes nettes als Antwort:<br>

<br>

From: postmaster@Bertelsmann.de<br>

Subject: Delivery Status Notification (Failure)<br>

<br>

This is an automatically generated Delivery Status Notification.<br>

<br>

Delivery to the following recipients failed.<br>

<br>

       kontakt@sonybmg.com<br>

<br>

Ein Grund oder so wird natürlich nicht angegeben, die haben ja root ;-)<br>

<br>

2. <a href="http://www.clipfish.de/impressum.php">http://www.clipfish.de/impressum.php</a><br>

Wenn man eine Mail an feedback@clipfish.de sendet, bekommt man von RTL:<br>

<br>

501 Rcpt-To<br>

    validation failed: RCPT TO not accepted: This system is not configured to<br>

    relay mail (r) from &lt;sargentd@die-welt.net&gt; to &lt;feedback@clipfish.de&gt; for<br>

    127.0.0.1 (in reply to RCPT TO command)<br>

<br>

Dabei steht der Host assur.rtl.de als Primary-MX im DNS von clipfish.de. Schon komisch...<br>

<br>

Naja, ich geh ins Bad und wünsche euch viel Spaß mit der Welt.</p></body></html>