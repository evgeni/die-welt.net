<html><body><p>Wie ihr wisst, hab ich ein Thinkpad, mit dem ich auch schon mal unterwegs bin. Da braucht man manchmal auch Internet und man findet gerade kein offenes WLAN. Mit dem passendem Kleingeld in der Tasche kann man sich per GPRS mit Vodafone verbinden und E-Mails abrufen (mehr würde ich aus Kostengründen nicht machen). Dazu habe ich mir von meinem Vater das passende USB Datenkabel (Nokia CA-53) für mein Nokia 6230i ausgeliehen, da ich irgendwie keins habe und angefangen mein Debian zu vergewaltigen.<br>
<br>
Beim Einstöpseln des USB-Kabels fragt das Handy, ob man es "als Speichergerät verwenden" möchte - heißt im Klartext, dass es sich wie ein USB-Storage verhält, man kann aber nur auf die MMC zugreifen, nicht auf die Daten im Handyspeicher. Also abbrechen und das Handy ist nun einfach angeschlossen. lsusb sagt:<br>
<br>
Bus 003 Device 005: ID 0421:0428 Nokia Mobile Phones<br>
Device Descriptor:<br>
  bLength                18<br>
  bDescriptorType         1<br>
  bcdUSB               1.10<br>
  bDeviceClass            2 Communications<br>
  bDeviceSubClass         0<br>
  bDeviceProtocol         0<br>
  bMaxPacketSize0        64<br>
  idVendor           0x0421 Nokia Mobile Phones<br>
  idProduct          0x0428<br>
  bcdDevice            3.50<br>
  iManufacturer           1 Nokia<br>
  iProduct                2 Nokia 6230i<br>
  iSerial                 0<br>
  bNumConfigurations      1<br>
...<br>
<br>
Wenn der Kernel bereits mit <strong>CONFIG_USB_ACM=m</strong> gebaut ist, wird das cdc_acm Modul geladen und /dev/ttyACM0 erstellt (ich musste erstmal Kernel neubauen).<br>
Bis dato hatte ich keinen Erfolg Wammu oder Gammu zum Funktionieren zu bewegen. Liegt anscheinend am Kabel (über Infrarot hab ich das mal vor längerer Zeit gemacht) ist aber nicht so tragisch, denn ich möchte primär ins Internet. Dafür braucht man den pppd, unter Debian im Paket "ppp" enthalten. Des weiteren muss der Kernel mit PPP-Unterstützung gebaut sein (war meiner natürlich wieder nicht). Also mal schauen ob man folgende Optionen hat:<br>
CONFIG_PPP=m<br>
CONFIG_PPP_MULTILINK=y<br>
CONFIG_PPP_FILTER=y<br>
CONFIG_PPP_ASYNC=m<br>
<br>
Bei Multilink und Filter bin ich mir nicht sicher, dass man sie braucht, aber schaden tun sie nicht.<br>
Wenn der Kernel und Userspace bereit für PPP sind, muss man dieses konfigurieren. Also geht man auf <a href="http://www.vodafone.de/business/support_download/59330.html" target="_blank">vodafone.de</a> und schaut sich die GPRS Einstellungen an. Daraus ergeben sich dann folgende zwei Konfigurationsdateien:<br>
<br>
chatscipt (/etc/chatscripts/vodafone-gprs):<br>
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
OK              'AT+CGDCONT=1,"IP","web.vodafone.de"'<br>
OK              ATD*99#<br>
CONNECT ""<br>
<br>
peer (/etc/ppp/peers/vodafone-gprs):<br>
connect "/usr/sbin/chat -v -f /etc/chatscripts/vodafone-gprs"<br>
/dev/ttyACM0<br>
115200<br>
noipdefault<br>
usepeerdns<br>
defaultroute<br>
persist<br>
noauth<br>
<br>
Nun reicht ein herzliches <strong>pon vodafone-gprs</strong> und nach wenigen Sekunden hat man eine Verbindung. <strong>poff vodafone-gprs</strong> beendet diese dann wieder.<br>
Das Problem ist nun, dass GRPS-by-Call bei Vodafone ca 19Cent pro 10KB kostet und ich mir das auf Dauer nicht leisten kann. Bei ALDI-Talk kriegt man 1MB für 24Cent, was ich recht okay finde (wenn auch super teuer im Vergleich zu DSL oder Cable) und man darf (passende Hardware vorausgesetzt) UMTS zu selben Preisen nutzen. Der Hacken an der Sache ist, dass ALDI-Talk im E-Plus Netz werkelt, und die absolut bescheidene Abdeckung haben, was GPRS und UMTS angeht. Mal schauen, werde mir so ne Prepaid Karte dennoch holen denk ich, und dann sehen wir weiter. Immerhin hab ich keine Kosten wenn das Ding in der Ecke vergammelt.</p></body></html>