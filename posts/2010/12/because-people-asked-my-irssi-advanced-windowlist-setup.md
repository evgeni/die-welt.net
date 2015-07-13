<html><body><p>As XTaran and uschebit asked yesterday at the 27C3 about my "nice" windowlist in irssi, here is what I use: <a href="http://anti.teamidiot.de/static/nei/*/Code/Irssi/adv_windowlist.pl">adv_windowlist.pl</a>. Download it, put it into you <code>~/.irssi/scripts</code> and load it with <code>/script load adv_windowlist</code>. Now you have a list with all those window names in them, but it's still a bit ugly ;)



First of all, get rid of the default Act list of irssi: <code>/statusbar window remove act</code>



Now let's customize awl a bit:

</p><ul>

	<li>Shorten window names to 10 chars, so we can get more windows in one row:﻿

<code>/set awl_block = 10</code>

<code>/set awl_sbar_maxlength = ON</code></li>

	<li>Display a maximum of 5 rows of windows so irssi is still usable on my Milestone with the 122x30 char screen:

<code>/set awl_maxlines = 5</code></li>

	<li>Shorten the windowname layout a bit, strip the shortcut display, remove the braces around the window number:

<code>/set awl_display_key = $N$H$C$S</code>

<code>/set awl_display_nokey = $N$H$C$S</code></li>

</ul>

Done! Your irssi should look like this now:



<a href="/wp-content/uploads/2010/12/irssi-awl.png"><img class="alignnone size-medium wp-image-759" title="irssi advanced windowlist" src="https://www.die-welt.net/wp-content/uploads/2010/12/irssi-awl-300x181.png" alt="" width="300" height="181"></a></body></html>