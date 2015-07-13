<html><body><p>Gerade in #hackerboard auf irc.german-freakz.net:<br>

<br>

[14:54:13] &lt;Snake&gt; kennt einer zufällig ein programm, mit dem ich unter Linux viele Bilddateien auf einmal in Auflösung und dateigröße vrekleiner kann?<br>

[14:59:40] &lt;Zhenech&gt; Snake, find und convert (aus imagemagick) sind deine freunde ;)<br>

[15:00:33] &lt;Zhenech&gt; find /dir -iname "*.jpg" -exec convert -gemetry 100x100 {} \;<br>

[15:00:35] &lt;Zhenech&gt; oder so ähnlich<br>

[15:00:49] &lt;soxx&gt; geometry^^<br>

[15:00:54] &lt;Zhenech&gt; ja<br>

[15:00:56] &lt;Zhenech&gt; man find<br>

[15:00:59] &lt;Zhenech&gt; man convert<br>

[15:01:03] &lt;soxx&gt; :)<br>

[15:01:05] &lt;Zhenech&gt; das war grad ausm kopf getippert ;)<br>

[15:01:32] &lt;soxx&gt; ich wollte nur vermeiden, dass es zu einem copy&amp;paste-error kommt und gleich ne dumme frage auftaucht<br>

[15:02:40] &lt;Zhenech&gt; find / -exec rm -rf {} \;<br>

[15:02:46] &lt;Zhenech&gt; *duck'n'run'<br>

[15:03:08] &lt;soxx&gt; rofl<br>

[15:04:51] &lt;Zhenech&gt; find / -type f -exec dd if=/dev/null of={} \;<br>

[15:04:53] &lt;Zhenech&gt; ;~<br>

[15:06:01] &lt;soxx&gt; lauter beweise dafür, dass man auch mit wenig code viel müll machen kann :)<br>

[15:07:13] &lt;Zhenech&gt; soxx: der schönste ist `cat /dev/urandom | uuencode &gt; /dev/nvram`<br>

[15:07:31] &lt;Zhenech&gt; dürfte dein bios und so in etwa komplett schrotten<br>

[15:09:39] &lt;soxx&gt; ach, in /proc/acpi kann man auch spaß haben<br>

[15:09:57] &lt;Zhenech&gt;  /proc/acpi is depricated *sing* ;)<br>

[15:10:15] &lt;soxx&gt; deprecated, ja.. aber.. ach<br>

[15:10:41] &lt;soxx&gt; acpi läuft auf meinem laptop sowieso net vernünftig unter linux :)<br>

[15:11:03] &lt;Zhenech&gt; aber ja, echo disabled &gt; /proc/acpi/ibm/fan &amp;&amp; cd /usr/src/linux &amp;&amp; for i in `seq 0..100`; make &amp;&amp; make clean; done<br>

[15:12:15] &lt;soxx&gt; Zhenech, jetzt überlegst du dir jeden tag son script, und nach 3 monaten bringst du ein buch darüber raus<br>

[15:12:26] &lt;soxx&gt; nach 12 monaten kanns en band werden :)<br>

[15:12:47] &lt;Zhenech&gt; soxx: erm? so wie mach ich mein rechner putt scripte?<br>

[15:12:59] &lt;soxx&gt; genau<br>

[15:13:19] &lt;Zhenech&gt; rm -rf / &amp;&amp; exec D:\winsetup.exe XD<br>

[15:13:42] &lt;soxx&gt; da kommen sicher einige sehr kreative sachen dabei raus, wenn man sich länger damit beschäftigt<br>

[15:14:23] &lt;soxx&gt; rofl.. naja<br>

[15:14:42] &lt;Zhenech&gt; fork bomb, fork bomb, you're my fork bomb... XD<br>

[15:14:43] &lt;soxx&gt; die pointe ist gut :D<br>

[15:15:58] &lt;jorey&gt; :(){ :|:&amp; };:<br>

<br>

Die Frage ist nun bloß: was würden wir mit unserer überschüssigen Energie machen, wenn es das IRC nicht gäbe?</p></body></html>