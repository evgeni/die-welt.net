<html><body><p>Ich bin ja auf der ewigen Mission mein Laptop auch unterwegs im Netz haben zu können. Dazu habe ich ja bereits einige Experimente mit <a href="http://www.die-welt.net/index.php/blog/158/GPRS_unter_Linux_mit_Nokia_6230i_und_Vodafone.de">Vodafone und meinem 6230i</a> gemacht, und anschließen das gleiche mit <a href="http://www.die-welt.net/index.php/blog/159/GPRS_unter_Linux_mit_Nokia_6230i_und_ALDI-Talk_%28E-Plus%29">ALDI-Talk bzw E-Plus</a> wiederholt, wodurch ich schonmal per GPRS surfen konnte. Da GPRS aber nur eine sehr magere Leistung von 2-4KB/s bringt, ist der Spaß beim Surfen eher gedämpft. Da muss eigentlich UMTS her, aber ich habe derzeit kein Gerät da (mein Vater hat ein Nokia 6288, aber der ist gerade nicht da). Praktischerweise ist heute früh aber meinem Cheff sein Notebook gestorben (Gruß an dieser Stelle an MSI - wieso bootet das Ding plötzlich nicht mehr?!) und er hatte da eine UMTS Karte von E-Plus drin. Habe ihn also vorhin im Büro angehauen und bis nächste Woche das Kärtchen ausgeliehen bekommen.<br>

<br>

Einstecken unf Funktionieren ist ja leider bei Linux nicht immer der Fall (obwohl es bei dieser Karte sein könnte), also erstmal ein wenig gegoogelt.<br>

Bei der von E-Plus als "UMTS Notebook Card II" vertrieben Karte handelt sich eigentlich um eine GlobeTrotter 3G Quad von Option, die sich beim Einstecken in den CardBus-Slot als USB-Controller meldet und auf diesem eine serielle Schnittstelle zum Modem anbietet.<br>

<br>

Damit die Karte nun tatsächlich funktioniert braucht man folgende drei Optionen im Kernel:<br>

<strong>CONFIG_USB_OHCI_HCD=m<br>

CONFIG_USB_SERIAL=m<br>

CONFIG_USB_SERIAL_OPTION=m</strong><br>

<br>

Der erste Eintrag ist für den NEC USB-Chip, der zweite für die allgemeine USB-to-Serial Unterstützung und der letzte für eben diese Option Karte. Netterweise war der erste bei mir nicht gesetzt (ich habe hier sonst nur EHCI und UHCI) und deswegen wurde das erstmal nichts mit online. Kurz den Kernel kompiliert (nach mindestens 10 Minuten grübeln warum das nu nicht geht :() und schon flutscht es. Ich stecke die Karte rein und sehe folgendes in <strong>dmesg</strong>:<br>

<br>

pccard: CardBus card inserted into slot 0<br>

ohci_hcd: 2006 August 04 USB 1.1 'Open' Host Controller (OHCI) Driver (PCI)<br>

PCI: Enabling device 0000:16:00.0 (0000 -&gt; 0002)<br>

ACPI: PCI Interrupt 0000:16:00.0[A] -&gt; GSI 16 (level, low) -&gt; IRQ 17<br>

PCI: Setting latency timer of device 0000:16:00.0 to 64<br>

ohci_hcd 0000:16:00.0: OHCI Host Controller<br>

ohci_hcd 0000:16:00.0: new USB bus registered, assigned bus number 6<br>

ohci_hcd 0000:16:00.0: irq 17, io mem 0x50000000<br>

usb usb6: configuration #1 chosen from 1 choice<br>

hub 6-0:1.0: USB hub found<br>

hub 6-0:1.0: 1 port detected<br>

PCI: Enabling device 0000:16:00.1 (0000 -&gt; 0002)<br>

ACPI: PCI Interrupt 0000:16:00.1[B ] -&gt; GSI 16 (level, low) -&gt; IRQ 17<br>

PCI: Setting latency timer of device 0000:16:00.1 to 64<br>

ohci_hcd 0000:16:00.1: OHCI Host Controller<br>

ohci_hcd 0000:16:00.1: new USB bus registered, assigned bus number 7<br>

ohci_hcd 0000:16:00.1: irq 17, io mem 0x50001000<br>

usb usb7: configuration #1 chosen from 1 choice<br>

hub 7-0:1.0: USB hub found<br>

hub 7-0:1.0: 1 port detected<br>

usb 7-1: new full speed USB device using ohci_hcd and address 2<br>

usb 7-1: configuration #1 chosen from 1 choice<br>

usbcore: registered new interface driver usbserial<br>

drivers/usb/serial/usb-serial.c: USB Serial support registered for generic<br>

usbcore: registered new interface driver usbserial_generic<br>

drivers/usb/serial/usb-serial.c: USB Serial Driver core<br>

drivers/usb/serial/usb-serial.c: USB Serial support registered for GSM modem (1-port)<br>

option 7-1:1.0: GSM modem (1-port) converter detected<br>

usb 7-1: GSM modem (1-port) converter now attached to ttyUSB0<br>

option 7-1:1.1: GSM modem (1-port) converter detected<br>

usb 7-1: GSM modem (1-port) converter now attached to ttyUSB1<br>

option 7-1:1.2: GSM modem (1-port) converter detected<br>

usb 7-1: GSM modem (1-port) converter now attached to ttyUSB2<br>

option 7-1:1.3: GSM modem (1-port) converter detected<br>

usb 7-1: GSM modem (1-port) converter now attached to ttyUSB3<br>

usbcore: registered new interface driver option<br>

drivers/usb/serial/option.c: USB Driver for GSM modems: v0.7.1<br>

<br>

Entgegen allen Meldungen im Netz musste ich usbserial auch keine kryptischen Optionen mitgeben, es lief einfach.<br>

Wie man sieht wurden direkt vier Devices angelegt, und ich konnte das Modem auch über alle ansprechen. Jetzt noch kurz <strong>/dev/ttyUSB0</strong> statt /dev/ttyACM0 vom Nokia in die /etc/ppp/peers/eplus-gprs eintragen und nach einem <strong>pon eplus-gprs</strong> ist man online. Vorrausgesetzt man hat auf der Karte die PIN deaktiviert, was ich habe. Irgendwie kann man dem die PIN aber auch übergeben.<br>

<br>

Nach einem kurzen Speedtest stellte ich jedoch fest, dass ich weiterhin nur GPRS hatte. Doof, dabei hieß es doch, man könnte UMTS mit ALDI-Talk nutzen (zumindest las ich das in Foren und bei <a href="http://www.teltarif.de/arch/2007/kw05/s24744.html" target="_blank">teltarif.de</a>, bei ALDI sagt man, das ginge nicht). Muss ich die Tage mal irgendwo in der Stadt testen, wo es gehen <strong>sollte</strong> (bei E-Plus weiß man nie...).<br>

<br>

Noch ein Tipp am Schluss, es gibt ein nettes Tool namens gcom bzw comgt (<a href="http://sourceforge.net/projects/comgt">http://sourceforge.net/projects/comgt</a>, unter Debian Etch/Sid reicht ein "apt-get install gcom"), damit kann man der Karte allerlei Informationen entlocken: <strong>gcom -d /dev/ttyUSB0</strong>.</p></body></html>