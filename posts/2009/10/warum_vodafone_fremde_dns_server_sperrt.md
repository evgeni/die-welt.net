<html><body><p>Ich weiss, die Story ist alt, und die tricks auch.<br>

Dennoch wurd ich grad auf <a href="http://www.zdnet.de/sicherheit_in_der_praxis_sperre_von_freien_dns_servern_so_umgeht_man_die_blockade_story-39001543-41502966-1.htm">ZDNet: Sperre von freien DNS-Servern: So umgeht man die Blockade</a> gelinkt und musste bei einem Absatz schmunzeln. Lest selbst:<br>

<br>

<i>Betroffen sind alle Anwender, die einen Internetzugang über den APN event.vodafone.de nutzen. Über diesen APN erhalten Vodafone-Kunden einen eingeschränkten Internet-Zugang mit einer privaten IP-Adresse und NAT-Routing aus dem Bereich 10.0.0.0/8. UDP-Traffic auf Port 53, der nicht zu den Vodafone-DNS-Servern führt, ist bei diesem Zugang gesperrt. Einen technischen Grund dafür gibt es nicht. Andere Provider, die einen NAT-Zugang anbieten, kommen ohne Sperren aus.</i><br>

<br>

<i>Nicht betroffen sind hingegen die Vodafone-Kunden, die den APN web.vodafone.de nutzen. Dieser Zugang steht nur Kunden mit Laufzeitvertrag zur Verfügung. Sie erhalten einen vollwertigen, aber meist kostenintensiveren Internetzugang mit öffentlicher IP-Adresse. ZDNet hat dabei keine Behinderung beim Zugang zu DNS-Servern festgestellt.</i><br>

<br>

Oh, es sind ja zwei Absaetze. Egal.<br>

<br>

Ich bin seit einiger Zeit kein Vodafone Kunde mehr, aber damals kriegte man auch ueber web.vodafone.de eine geNATtete IP-Adresse. Wenn sich das heute geaendert hat: bitte.<br>

Prepaid Kunden nutzen bei Vodafone uebrigens auch web.vodafone.de. Wer nutzt denn dann event.vodafone.de? Ahja, richtig, Vertrags und Prepaid Kunden, die WebSessions wollen. Also den Tarif wo man fuer zB fuer 1 Stunde im voraus buchen kann. Wie bucht man? Ueber ein Webinterface.<br>

<br>

Jetzt nochmal nachdenken.<br>

Fester!<br>

<br>

Wenn der Kunde (unabsichtlich) einen anderen DNS Server hat, kommt er nicht auf das Interface, kann nicht buchen, ist sauer, und Vodafone entgeht Gewinn.<br>

Wenn der Kunde (absichtlich) TCP Traffic durch DNS Tunneln will, ach das darf ich hier bestimmt nicht schreiben. Also mitdenken liebe Leser! Aber bevor ihr fragt: ja, das surfen im WebSessions Portal zum Buchen ist kostenlos.<br>

<br>

Und so wie ich Vodafone kenne, wuerden sie niemals filtern, wenn das nicht fuer Abrechnungszwecke erforderlich waere.</p></body></html>