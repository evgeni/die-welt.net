<html><body><p>Gerade las ich in einem Bugreport (<a href="http://bugs.debian.org/446901" target="_blank">#446901</a>), man soll bitte<br>
<strong>ps -ef | grep compiz.real | grep -v grep \<br>
| awk '{print "kill -HUP "$2}' | bash</strong><br>
ausführen, um dem Prozess compiz.real SIGHUP zu schicken. Srsly!<br>
<br>
Ich dachte man nimmt dafür <strong>kill -HUP `pidof compiz.real`</strong> oder <strong>killall -HUP compiz.real</strong>, aber DAS ist wirklich Kunst. Danke Giacomo.</p></body></html>