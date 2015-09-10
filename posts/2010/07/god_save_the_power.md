<html><body><p>Tonight, we had a longish power failure, and here is what I read in my syslog today:<br>
<br>
</p><pre><br>
Jul  3 02:27:16 dorei upsmon[3230]: UPS powermust@localhost on battery<br>
Jul  3 02:57:19 dorei upsmon[3230]: UPS powermust@localhost battery is low<br>
Jul  3 02:57:19 dorei upsd[3225]: Client nut@127.0.0.1 set FSD on UPS [powermust]<br>
Jul  3 02:57:19 dorei upsmon[3230]: Executing automatic power-fail shutdown<br>
Jul  3 02:57:19 dorei upsmon[3230]: Auto logout and shutdown proceeding<br>
Jul  3 02:57:24 dorei upsd[3225]: Host 127.0.0.1 disconnected (read failure)<br>
Jul  3 02:57:24 dorei shutdown[31656]: shutting down for system halt<br>
Jul  3 02:57:24 dorei init: Switching to runlevel: 0<br>
</pre><br>
<br>
So thanks to my UPS and the great network-ups-tools, no data is lost and I just had to power-up my machine again.<br>
<br>
Next task: wake over USB when power is there again from the UPS :)</body></html>