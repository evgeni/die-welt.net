<html><body><p>Da ich die doch leider etwas häufigen Stromausfälle hier satt war, habe ich mir vor einer Woche eine USV geholt - Mustek PoweMust 1000 USB. Eine Unterbrechungsfreie Strom Versorgung. Welch tolles Wort. Naja, nach einigem Rumgewarte wegen UPS (United Parcel Service, obwohl UPS im englischen auch Uninterruptible power supply, also USV, bedeutet) hatte ich das Ding dann hier und probierte sie erstmal an meiner Sid Workstation aus.<br>

<br>

Die USV besitzt sowohl einen USB, als auch einen Seriellen Anschluss. Beim näherem Betrachten bemerkt man, dass der USB auch nur ein Serial-toUSB Converter ist, und dann auch noch von der Sorte, dessen Treiber ich nicht im Kernel hatte (den Treiber gibts aber, hab den halt nur ned reinkompiliert gehabt). Also an RS323 angeschlossen und weitergeschaut. Mustek liefert eine CD mit, wo sich auch Tools für Linux befinden. Die Installation schlägt (leider) fehl, da das Install-Script versucht Java vn der CD zu starten, anstatt das Java von meinem System zu nehmen. [Interessante Anmerkung an der Stelle: vor dem versuchten Java-Start, kam kein Hinweis auf die Sun-Lizenz - dürfen die das?]<br>

Naja, auf jeden fall hab ich mir dann die <strong>networkupstools (2.0.4)</strong> installiert (<strong>apt-get install nut</strong>) und die wollen dann eingerichtet werden.<br>

<br>

/etc/nut/ups.conf:<br>

[mustek]<br>

      driver = megatec<br>

      port = /dev/ttyS0<br>

      desc = "PowerMust"<br>

<br>

Das sagt aus, dass es eine USV namens "mustek" gibt, sie den megatec Treiber braucht und an ttyS0 hängt. Dabei ist zu beachten, dass man <strong>chown root:nut /dev/ttyS0</strong> ausgeführt hat, denn sonst hat der Treiber nicht genug Rechte gleich.<br>

<br>

/ect/nut/upsd.conf:<br>

ACL all 0.0.0.0/0<br>

ACL localhost 127.0.0.1/32<br>

<br>

ACCEPT localhost<br>

REJECT all<br>

<br>

Erlaube localhost, verbiete alles Andere.<br>

<br>

/etc/nut/upsd.users:<br>

[nut]<br>

        password  = nut<br>

        allowfrom = localhost<br>

        upsmon master<br>

<br>

User mit dem Namen "nut" und dem Passwort "nut" darf von localhost (dabei ist localhost der Name des ACLs in upsd.conf) upsmon master sein.<br>

<br>

/etc/nut/upsmon.conf<br>

RUN_AS_USER nut<br>

MONITOR mustek@localhost 1 nut nut master<br>

MINSUPPLIES 1<br>

SHUTDOWNCMD "/sbin/shutdown -h +0"<br>

POLLFREQ 5<br>

POLLFREQALERT 5<br>

HOSTSYNC 15<br>

DEADTIME 15<br>

POWERDOWNFLAG /etc/killpower<br>

RBWARNTIME 43200<br>

NOCOMMWARNTIME 300<br>

FINALDELAY 5<br>

<br>

Da hab ich grad keine Lust, die einzelonen Optionen zu beschreiben - RTFM =)<br>

<br>

Nach einem /etc/init.d/nut start lief dann auch alles, ich sah in /bar/log/daemon.log die Meldungen des upsmon, wenn ich Strom abgezogen hab, und die USV auf Akku lief, etc. Per <strong>upsc mustek@localhost</strong> konnte ich die USV dann auch händisch abfragen.<br>

<br>

Die USV funktioniert also. Jetzt der große Schritt: die soll eigentlich an meinen Router/Fileserver und die dort stehenden Netgear WLAN Gedönse und das Motorolla Cable Modem.<br>

<br>

Hab also die USV rübergeschleppt und angeschlossen. Konfiguration wie oben übernommen und promt ging es nicht. Problem war, dass unter Sarge nut 2.0.1 und nicht 2.0.4 wie unter Sid ist, und da es keinen megatec Treiber gibt, aber den powermust, also <strong>driver = powermust</strong> in die ups.conf und schon konnte das Dingen starten. Damit ich nicht händisch nach jedem Reboot (der ab jetzt nicht so oft vorkommen sollte) die Rechte von /duv/ttyS0 ändern muss, hab ich udev noch eine kleine tolle Regel geschenkt.<br>

<br>

/etc/udev/rules.d/local.rules:<br>

KERNEL="ttyS0", GROUP="nut"<br>

<br>

Das wars. Jetzt wird ttyS0 beim Boot der Gruppe nut zugewiesen, wo nut dann alles lesen kann. Ahja, aus sicherheitsgrüden sollte man noch ein <strong>chmod 640 /etc/nut/*</strong> und ein <strong>chown root:nut /etc/nut/*</strong> machen. Nun kann der User root die Dateien ändern, aber der User nut nur lesen - für den Fall der Fälle falls es in nut je ein remote Exploit oder ähnliches geben sollte.</p></body></html>