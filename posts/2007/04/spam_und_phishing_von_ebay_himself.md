<html><body><p>Gestern bekam ich eine Mail von eBay - eine Rechnung für den vergangenen Monat, immerhin habe ich ja etwas verkauft und eBay möchte daran auch etwas verdienen. Soweit ja noch alles okay, denn würd ich denen nix zahlen wollen, würd ich da auch nix verkaufen. Erstaunt hatte mich die Mail schon, denn ich durfte sie aus meinem (nicht all zu leerem) Spam-Ordner rausfischen (ich guck da alle paar Tage mal drüber, ob evtl false-positives gibt).<br>
<br>
Die große Frage ist natürlich, wie die Mail dahinkommt, also schau ich sie mir mal genauer an:<br>
From: billing@ebay.de<br>
To: sargentd@sargentd.net<br>
<strong>Cc: </strong><br>
Subject: ***SPAM*** eBay-Rechnung f<strong>Ã¼</strong>r Sonntag, 15. April 2007<br>
Date: <strong>DO 19, APR 2007 09:29:04</strong><br>
<br>
Ein leeres Cc:? Wozu dass den? Die schicken doch keine Bccs an info@bundestrojaner.de und haben vergessen den Cc: Header zu entfernen?<br>
UTF-8 kodierte Daten im Subject? Sowas gehört sich auch nicht (ohne das entsprechende verpacken in lange hässliche 7-Bit Strings).<br>
Ein <strong>deutsches</strong> Datum, ohne Zeitzone, ohne nix? Wie soll den mein Mailer sowas parsen (gut, er könnte raten, aber wenn ich dran denke, dass ich hier auch schon mal Mails aus Japan und Brasilien habe...)<br>
<br>
Aber das reicht nie und nimmer für ein Spam-Score &gt; 4.5 um das als Spam zu markieren...<br>
<br>
Mal sehen, was der SpamAssassin so alles geloggt hat:<br>
<br>
X-Spam-Flag: YES<br>
X-Spam-Score: 5.232<br>
5.2? Nicht schlecht... Das schaffen nicht mal alle richtigen Spammer...<br>
<br>
X-Spam-Level: *****<br>
X-Spam-Status: Yes, score=5.232 tagged_above=-1000 required=4.5<br>
	tests=[AWL=-2.127, BAYES_00=-2.599, DATE_IN_PAST_12_24=1.247,<br>
DATE_IN_PAST? Naja, nicht ganz, aber wer einen nicht parse-baren String da hinklatscht verdient es nicht anders...<br>
<br>
	DNS_FROM_RFC_ABUSE=0.2, FUZZY_CREDIT=1.079, INVALID_DATE=2.193,<br>
RFC_ABUSE? Geil, wenn die da wirklich gelistet sind - Idioten<br>
FUZZY_CREDIT? "Attempt to obfuscate words in spam"? Seh ich in der Mail auf den ersten Blick zwar nicht, aber SA wirds schon wissen...<br>
INVALID_DATE? ACK!<br>
<br>
	NO_REAL_NAME=0.961, SPF_PASS=-0.001, SUBJ_ILLEGAL_CHARS=4.279]<br>
NO_REAL_NAME? Stimmt, ist eine Maschine, aber "eBay Rechnungs-Abteilung &lt;rechnung@ebay.de&gt;" wäre schon schön.<br>
SUBJ_ILLEGAL_CHARS? Ahjo, wer da es nicht schafft das richtig zu kodieren, selbst schuld.<br>
<br>
Und was lernen wir daraus? Hätten de Jungs mal dran gedacht und einen fähigen Frickler anstatt eines MSCEs als Programmierer einzustellen, wäre da nu nicht passiert - und das alles wegen läppischen 2 Euro irgendwas</p></body></html>