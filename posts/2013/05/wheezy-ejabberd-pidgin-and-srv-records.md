<html><body><p>TL;DR: <code>{fqdn, "jabber.die-welt.net"}.</code>



So, how many servers do you have, that are still running Squeeze? I count one, mostly because I did not figure out a proper upgrade path from OpenVZ to something else yet, but this is a different story.



This post is about the upgrade of my "communication" machine, <code>dengon.die-welt.net</code>. It runs my private XMPP and IRC servers. I upgraded it to Wheezy, checked that my <code>irssi</code> and my <code>BitlBee</code> still could connect and left for work. There I noticed, that <code>Pidgin</code> could only connect to one of the two XMPP accounts I have on that server. <code>sargentd@jabber.die-welt.net</code> worked just fine, while <code>evgeni@golov.de</code> failed to connect.



ejabberd was logging a failed authentication:

<code>I(&lt;0.1604.0&gt;:ejabberd_c2s:802) : ({socket_state,tls,{tlssock,#Port&lt;0.5130&gt;,#Port&lt;0.5132&gt;},&lt;0.1603.0&gt;}) Failed authentication for evgeni@golov.de

</code>

While Pidgin was just throwing "Not authorized" errors.



I checked the password in Pidgin (even if it did not change). I tried different (new) accounts: <code>anything@jabber.die-welt.net</code> worked, <code>nothing@golov.de</code> did not and <code>somethingdifferent@jabber.&lt;censored&gt;.de</code> worked too. So where was the difference between the three vhosts? <code>jabber.die-welt.net</code> and <code>jabber.&lt;censored&gt;.de</code> point directly (A/CNAME) to <code>dengon.die-welt.net</code>. <code>golov.de</code> has <code>SRV</code> records for XMPP pointing to <code>jabber.die-welt.net</code>.



Let's ask Google about "ejabberd pidgin srv". <a href="https://bugs.launchpad.net/ubuntu/+source/ejabberd/+bug/1048634">There</a> <a href="http://bugs.debian.org/cgi-bin/bugreport.cgi?bug=654853">are</a> <a href="https://support.process-one.net/browse/EJAB-1529">some bugs</a>. But they are marked as fixed in Wheezy.



Mhh... Let's read again... Okay, I have to set <code>{fqdn, "&lt;my_srv_record_name&gt;"}.</code> when this does not match my hostname. Edit <code>/etc/ejabberd/ejabberd.cfg</code>, add <code>{fqdn, "jabber.die-welt.net"}.</code> (do not forget the dot at the end) and restart the <code>ejabberd</code>. Pidgin can connect again. Yeah.</p></body></html>