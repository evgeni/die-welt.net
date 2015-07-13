<html><body><p>Ja ich weiß, der <a href="http://www.worldipv6launch.org/">IPv6 Launch Day</a> war gestern, aber da hatte ich Blutdruck und nicht so richtig Zeit euch was zu erzählen.



Jedes mal, wenn man irgendwo etwas von IPv6 hört (oder gar selbst was sagt), kommen die ach so tollen Datenschützer und schreien <a href="http://www.zeit.de/digital/internet/2012-06/ipv6-launch-day/komplettansicht">"Aua!"</a> und <a href="https://netzpolitik.org/2012/ipv6-launch-day-was-ist-ipv6-und-wie-wirkt-es-sich-aus/">"Ohje!"</a> und weil ich es nicht mehr hören kann, schrei ich einfach mal selber mit. Klingt doch wie ein Plan, oder? Oh, moment, das <a href="http://www.die-welt.net/2011/02/privacy-over-ip-does-not-exist/">habe ich doch letztes Jahr schonmal gemacht</a>, aber vielleicht können nicht so viele Leute Englisch, ich versuche es auf jeden Fall nochmal.



Also lieber Herr Beuth von der Zeit Redaktion, lieber Herr Tremmel von netzpolitik.org und auch Herr Schaar, hingesetzt und zugehört, bitte!



IPv6 bringt einige Neuerungen gegenüber dem (in die Jahre gekommenen) IPv4. Die wahrscheinlich Bekannteste ist der Anstieg des Adressbereichs von 2^32 auf 2^128 IP-Adressen (<a href="http://www.google.de/ipv6/">Google hat mal ausgerechnet wieviel das ist</a>). Das reicht zwar nicht, um <a href="http://www.wolframalpha.com/input/?i=estimated+number+of+atoms+in+the+Earth">jedem Atom auf der Erde</a> eine eigene IPv6-Adresse zu geben, für die Menschen und ihre elektronische Spielzeuge sollte es aber reichen (hoffe ich zumindest). Aber IPv6 bringt auch <a href="http://en.wikipedia.org/wiki/IPsec">IPsec</a> mit, welches es erlaubt, direkt auf der IP Schicht zu verschlüsseln und zu authentifizieren. Und <a href="http://de.wikipedia.org/wiki/Ipv6#Autokonfiguration">SLAAC</a> und ... eigentlich wollte ich gar nicht erzählen wie toll IPv6 ist.



Was euch stört ist die Anzahl der Adressen. Alles hat auf einmal eine eigene IP-Adresse. Jeder ist auf Schritt und Tritt verfolgbar. Ja, in ziemlich genau dem selben Maße wie heute! Wenn meine Logs nicht lügen (und das trauen sie sich nicht!), habe ich meine IPv4-Adresse mindestens seit dem 12. Februar 2012. Unverändert. Seit fast vier Monaten. Mein Provider ist Unitymedia, aber ich weiß, dass auch Andere (z.B. Vodafone) schon lange keine richtig dynamischen IPv4-Adressen mehr vergeben. Die meisten Leute sind doch eh dauer-online mit ihren Routern, da kann man denen auch die Adresse wiedergeben, wenn sie sich neu verbinden. Richtig, man ist heutzutage also schon genauso via IPv4-Adresse identifizierbar wie morgen via IPv6. Aber bei IPv6 hat doch jede Maschine (Computer, Handy, Tablet) eine <strong>ganz</strong> eigene Adresse! Aber nicht der Windows PC den jeder Schreihals zuhause hat (Update: <a href="https://bugs.launchpad.net/ubuntu/+source/procps/+bug/176125">und auch nicht bei Ubuntu</a>), der hat die Privacy Extensions automatisch an und bei <a href="http://isc.sans.edu/diary.html?storyid=10966">OSX und Linux kann man es ganz einfach einschalten</a>. <a href="http://www.heise.de/netze/artikel/IPv6-Privacy-Extensions-einschalten-1204783.html">Bei Heise stehts etwas komplizierter</a>. &lt;Update&gt;Wem das nicht reicht, der <a href="http://www.heise.de/netze/meldung/Deutsche-Telekom-stellt-Datenschutztechnik-fuer-IPv6-vor-1383772.html">kann ja gucken ob sein Provider ihm da helfen kann</a> oder mal <a href="http://www.heise.de/netze/artikel/OpenWRT-wuerfelt-IPv6-Praefixe-1445607.html">selbst Hand anlegen</a>.&lt;/Update&gt; Und übrigens lieber Herr Tremmel, Cookies gehen auch via IPv4. Wenn ich Cookies habe, muss ich niemanden mit der IP-Adresse tracken.



Und wenn wir (die bösen Netzwerker, Webseitenbetreiber, Admins, ...) euch schon nicht tracken wollen, dann hacken? Weil ja nun jeder Computer eine eigene Adresse hat? Auf einmal muss jeder Computer sicher gemacht werden? Er ist es nicht, weil ihr dachtet euer <a href="http://kalsey.com/2003/10/nat_is_not_a_firewall/">NAT ist auch eine Firewall</a>? Nun, die meisten aktuellen Router (die auch euer NAT machen) können ein wenig Firewall spielen, aber das können die auch bestimmt bei IPv6, wenn man es einschaltet. Und echt, eure Computer sind nicht von alleine sicher? Was passiert eigentlich wenn ihr mit dem Laptop bei Starbucks sitzt, oder im ICE, oder in der Uni, oder gar im Bundestag? Hat euch da schonmal jemand via WLAN gekitzelt? Wird mal Zeit. Man sollte sich wirklich nicht darauf verlassen in einem "sicheren" Netzwerk zu sein. Sowas gibt es nicht. Gab es nicht. Wird es auch nie geben, versprochen.



Wenn ihr wirklich Privatsphäre wollt, schaltet ihr Cookies aus und JavaScript auch. <a href="https://www.torproject.org/">UND BENUTZT TOR!</a> Und verschlüsseln solltet ihr auch!



Ach und Herr Beuth, nur weil die Provider meistens ein /64 Netz an ihre Kunden vergeben (Update: <a href="http://www.heise.de/netze/meldung/Deutsche-Telekom-stellt-Datenschutztechnik-fuer-IPv6-vor-1383772.html">die Telekom aber z.B. nicht, hier gibts /56, was wohl auch Empfehlung ist!</a>), heißt es lange noch nicht, dass der Präfix die Hälfte einer IPv6-Adresse ist. Ein Präfix ist ein Präfix und kann so groß/lang sein, wie der Provider es möchte, eine Hälfte sind immer 50%. Der Präfix den der Amerikanische Provider Sprint von der ARIN zugewiesen bekommen hat (ja, bei denen heißt das auch Präfix), lautet 2600::/29, hat also 99 "freie" Bits, und ist damit <strong>etwas</strong> weniger als die Hälfte.



Und jetzt Feierabend. Ich nutze mein IPv6, ich hab morgen noch Spaß, macht was ihr wollt!</p></body></html>