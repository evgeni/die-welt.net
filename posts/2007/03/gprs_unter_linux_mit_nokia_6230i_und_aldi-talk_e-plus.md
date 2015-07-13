<html><body><p>Ich habe ja bereits vorhin beschrieben, wie man mit Linux per GPRS ins Internet kommt, wenn man ein Nokia 6230i mit Datenkabel und Vodafone hat.<br>

Auch habe ich geschrieben, dass ich mit den Preisen von Vodafone überhaupt nicht zufrieden bin. Deswegen war ich vorhin bei ALDI-Süd und hab mir so ein ALDI-Talk Starter-Set geholt. Kostet 14.99 und enthält 10€ Guthaben. IMHO voll okay das Angebot, vor allem weil das MB Traffic nur 24 Cent kostet.<br>

<br>

ALDI-Talk arbeitet ja, wie auch Simyo, Blau.de etc, im E-Plus Netz. Deswegen musste ich mein ppp ein wenig umkonfigurieren, damit es klappt.<br>

Im Endeffekt musste ich aber nur den Zugangspunkt von web.vodafone.de auf internet.eplus.de stellen.<br>

<br>

# diff /etc/chatscripts/vodafone-gprs /etc/chatscripts/eplus-gprs<br>

12c12<br>

&lt; OK            'AT+CGDCONT=1,"IP","web.vodafone.de"'<br>

---<br>

&gt; OK            'AT+CGDCONT=1,"IP","internet.eplus.de"'<br>

<br>

Wer nicht flüssig diff-lesen kann...<br>

chatscript (/etc/chatscripts/eplus-gprs):<br>

TIMEOUT         5<br>

ECHO            ON<br>

ABORT           '\nBUSY\r'<br>

ABORT           '\nERROR\r'<br>

ABORT           '\nNO ANSWER\r'<br>

ABORT           '\nNO CARRIER\r'<br>

ABORT           '\nNO DIALTONE\r'<br>

ABORT           '\nRINGING\r\n\r\nRINGING\r'<br>

''              \rAT<br>

TIMEOUT         12<br>

OK              ATE1<br>

OK              'AT+CGDCONT=1,"IP","internet.eplus.de"'<br>

OK              ATD*99#<br>

CONNECT ""<br>

<br>

peer (/etc/ppp/peers/eplus-gprs):<br>

connect "/usr/sbin/chat -v -f /etc/chatscripts/eplus-gprs"<br>

/dev/ttyACM0<br>

115200<br>

noipdefault<br>

usepeerdns<br>

defaultroute<br>

persist<br>

noauth<br>

<br>

Interessanter Weise hab ich zwar vorhin 20KB Traffic gemacht, mein Guthaben ist aber immer noch bei vollen 10€. Die Jungs sind wohl etwas langsam.<br>

<br>

Mal die Tage mit Papas UMTS-Handy schauen, ob das auch klappt :&gt;</p></body></html>