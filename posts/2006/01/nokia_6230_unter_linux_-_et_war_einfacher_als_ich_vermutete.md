<html><body><p>Yoah. Ich hab nie gedacht, dass es so einfach sein wird, mein Nokia 6230 mit Hilfe eines SigmaTel STIR4200 USB mit meinem Rechner zu verbinden.<br>

Habe einfach den Kernel mit<br>

CONFIG_IRDA=m<br>

CONFIG_IRLAN=m<br>

CONFIG_IRCOMM=m<br>

CONFIG_SIGMATEL_FIR=m<br>

kompiliert, irda-utils (Debian Paket) installiert und noch die Module ircomm &amp; ircomm-tty geladen (diese wurden nicht automatisch geladen, als ich den STIR 4200 einsteckte). Schon konnte ich mit Wammu auf mein Handy zugreifen und da allet moegliche kaputt machen. Wammu an sich hat zwar noch den einen oder anderen Bug und auch noch nicht alle Funktionen von Gammu, aber das ist ja nicht weiter schlimm.<br>

Hier noch meine ~/.Wammu:<br>

[Gammu]<br>

Model=auto<br>

Device=/dev/ircomm0<br>

Connection=irdaphonet<br>

SyncTime=no<br>

LockDevice=no<br>

StartInfo=no<br>

<br>

(warum steht da eigentlich [Gammu]? - komisch, aber et funktioniert ja.<br>

In diesem Sinne: Happy SMS'ing<br>

<br>

Und noch paar Keywords: linux kernel stir4200 handy nokia 6230 irda ircomm wammu gammu</p></body></html>