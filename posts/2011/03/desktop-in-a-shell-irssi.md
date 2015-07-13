<html><body><p>Continuing my series about my <a href="https://www.die-welt.net/2011/02/desktop-in-a-shell/">desktop in a shell</a>, in this chapter I will present you my irssi setup.



Irssi is the most customized part of my setup, using many scripts from the irssi-scripts Debian package and some "from the internet", handling 6 irc networks with a total of 34 channels plus <del>Jabber</del>XMPP, ICQ, Twitter and identi.ca.﻿

</p><h2>My "custom" irssi settings</h2>

I like my conversations to look like "Buddy, you rock" instead of "Buddy: you rock", so:

<code>/set completion_char ,</code>



I also like <strong>*long highlighted text*</strong>, so:

<code>/set emphasis_multiword on</code>



Hide mIRC and ANSI colors when turned on. This can be used to eliminate angry fruit salad syndrome in some channels. (Quote from <a href="http://irssi.org/documentation/settings">irssi.org/documentation/settings</a>, do I have to say more?):

<code>/set hide_colors on</code>



When talking in more than one channel, it sometimes comes handy to repeat something from the past said in THAT channel, not searching though all:

<code>/set window_history on</code>



Tell irssi to shutup when away, noone will hear/see the beep anyways:

<code>/set beep_when_away off</code>



I want my screen to inform me about new messages, so I need this:

<code>/set bell_beeps on</code>



Beep for query text, notices, dcc, dcc text and hilight:

<code>/set beep_msg_level MSGS NOTICES DCC DCCMSGS HILIGH</code>

<h2>My used irssi scripts</h2>

<h3>active_notice.pl (from irssi-scripts)</h3>

Show notices in the active window or the corresponding query instead of the status-window.

No further configuration needed.

<h3>adv_windowlist.pl (from <a href="http://anti.teamidiot.de/static/nei/*/Code/Irssi/adv_windowlist.pl">anti.teamidiot.de</a>)</h3>

Some really smart windowlist, see <a href="http://www.die-welt.net/2010/12/because-people-asked-my-irssi-advanced-windowlist-setup/">my previous post about adv_windowlist.pl</a>, I won't explain its features and settings here again.

<h3>autorealname.pl (from irssi-scripts)</h3>

Show peoples real-name when they join (my $nick ←→ $name memory is poor :()

No further configuration needed.

<h3>chansort.pl (from irssi-scripts)</h3>

Automatically sort my channels alphabetically, grouped by network.

Enable via <code>/set chansort_autosort on</code>



<strong>&lt;Update&gt;</strong><a href="http://identi.ca/kaimi">kaimi</a> asked me yesterday, whether chansort could ignore the network and just sort <strong>ALL</strong> channels in alphabetical order. Well, it could not, until yesterday ;) Fetch either the <a href="http://files.die-welt.net/irssi/chansort-ignore.patch">patch against chansort.pl</a> or <a href="http://files.die-welt.net/irssi/chansort-ng.pl">"my" chansort-ng.pl</a> and set <code>chansort_ignore_network</code> to <code>ON</code>. You can also set <code>chansort_ignore_windowtype</code> to mix channels and queries if you like to.<strong>&lt;/Update&gt;</strong>

<h3>hack-whois-in-current-window.pl (from <a href="http://dgl.cx/irssi/hack-whois-in-current-window.pl">dgl.cx</a>)</h3>

Display /whois in the current window or the corresponding query instead of the status-window.

No further configuration needed.

<h3>keepnick.pl (from irssi-scripts)</h3>

Restore my nick after it is free again (like after a ping timepout).

Set the nick via <code>/keepnick [-net chatnet] [nick]</code>

<h3>nickserv.pl (from irssi-scripts)</h3>

Automatically authorize me on networks with NickServ.

Enable by settings services address, nick and password via:

<pre>/nickserv addnet freenode NickServ@services.

/nickserv addnick freenode Zhenech mypass</pre>

<h3>screen_away.pl (from irssi-scripts)</h3>

Set away when screen is detached.

Will be enabled automatically, but you maybe want to tweak <code>screen_away_message</code> :)

<h3>seen.pl (from irssi-scripts)</h3>

Add a <code>/seen nick</code> command to lookup when and where nick was online the last time.

No further configuration needed.

<h3>trackbar.pl (from irssi-scripts)</h3>

Draw a line when you switch irssi windows so you can see which part of the conversation you have already seen.

No further configuration needed.

<h2>BitlBee</h2>

I'm using <a href="http://bitlbee.org">BitlBee</a> as my irssi-to-every-im gateway of choice ;) But while it sounds easy, my setup isn't. I am using BitlBee only to connect to <code>jabber.die-welt.net</code>, my Jabber/XMPP server. There I have a <a href="http://code.google.com/p/pyicqt/">pyICQt</a> instance running, to connect to ICQ via Jabber (yes, BitlBee would support that directly, but that would fail on me when I would like to connect from a different Jabber-client). Twitter and <a href="http://identi.ca">identi.ca</a> are handled via Jabber too: identi.ca does support this by themself, for Twitter I use the <a href="http://tweet.im">tweet.im</a> service.

But besides of my strange setup, BitlBee is easy: <code>apt-get install bitlbee</code>, connect irssi to <code>localhost:6667</code>, you will be force-joined to <code>&amp;bitlbee</code>, where you do:

<pre>register somepassword

account add Jabber you@jabberserber.example.com jabberpassword

account on 0</pre>

and done, you@jabberserver.example.com is online :)



The all awaited screenshot (from my last irssi-post):

<a href="/wp-content/uploads/2010/12/irssi-awl.png"><img class="alignnone size-medium wp-image-759" title="irssi advanced windowlist" src="https://www.die-welt.net/wp-content/uploads/2010/12/irssi-awl-300x181.png" alt="" width="300" height="181"></a>

And the whole <code>~/.irssi/config</code>: <a href="http://files.die-welt.net/irssi-config.txt">http://files.die-welt.net/irssi-config.txt</a>, read it carefully while waiting for the next post about newsbeuter :)</body></html>