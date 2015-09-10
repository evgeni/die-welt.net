<html><body><p>I've just came across a link to the <a href="http://fireftp.mozdev.org/" target="_blank">FireFTP Firefox plugin</a>. It should be a nice ftp-client for Firefox, so I thought, I could try it.<br>
<br>
But fortune is against me today:<br>
<img src="http://www.die-welt.net/upload/you_need_firefox.png" alt="http://www.die-welt.net/upload/you_need_firefox.png"><br>
<br>
Hey! I AM using Firefox! Or maybe not? I'm using Iceweasel 2.0.0.1, which is a Firefox with all trademarked stuff removed. And it uses Iceweasel in it's User-Agent string, so this nice JavaScript works too good:<br>
<br>
              &lt;script type="text/javascript"&gt;<br>
                &lt;!--<br>
                if (navigator.userAgent.indexOf("Firefox") != -1) {<br>
                  document.writeln("&lt;a style=\"color:#040\" href=\"http:\/\/ftp.mozilla.org\/pub\/mozilla.org\/extensions\/fireftp\/fireftp-0.94.6-fx.xpi\"&gt; &lt;b&gt;Download FireFTP&lt;\/b&gt;&lt;\/a&gt;&lt;br\/&gt;");<br>
                  document.writeln("&lt;span class=\"smaller\"&gt;0.94.6 beta, English (only 100KB!)&lt;\/span&gt;&lt;br\/&gt;");<br>
                  document.writeln("&lt;span &gt;&lt;a class=\"smaller\" style=\"color: #666\" href=\"all.html\"&gt;Other Languages and Versions&lt;\/a&gt;");<br>
                } else {<br>
                  document.writeln("&lt;span class=\"smaller\"&gt;You need Firefox to use FireFTP.&lt;\/span&gt;&lt;br\/&gt;");<br>
                }<br>
                //--&gt;<br>
              &lt;/script&gt;<br>
<br>
Guys, why do you check such shit?<br>
But there seems to be a solution in <a href="http://bugs.debian.org/cgi-bin/bugreport.cgi?bug=399633" target="_blank">Debian Bug #399633</a>:<br>
Just a short note to add that changing the value (in about:config) of<br>
'general.useragent.extra.firefox' from 'Iceweasel/2.0' to 'Firefox/2.0'<br>
(or 'Iceweasel Firefox/2.0') should be enough to work around most of<br>
these broken websites.<br>
<br>
This one works for the FireFTP site, but it's IMHO a hack and the reason is also in the Debian BTS:<br>
If sites require that "Firefox" is present in the user agent string,<br>
they are likely to fail with Epiphany, Kazehakase, Galeon, Seamonkey,<br>
Iceape, and any new browser based on Gecko that would appear.<br>
<br>
So yes dear Lazyweb, please check for Gecko or completely leave this browser hacks.</p></body></html>