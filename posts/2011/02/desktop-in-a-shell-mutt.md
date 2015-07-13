<html><body><p>Continuing my series about a <a href="http://www.die-welt.net/2011/02/desktop-in-a-shell/">desktop in a shell</a>, today I will present you my <code>mutt</code> setup. I use mutt because it has no bugs and is a really good MUA for people loving consoles ;)



First of all you have to know, that all my mail is forwarded to my server and sorted into Maildirs via maildrop, so I do not care about sorting on my "desktop", which just fetches the mail via IMAP from the server ;)



I'm running <code>mutt-patched</code> from Debian Squeeze, so not all options may be available for you if you do not have the same patchset as I do.



First, tell mutt to fetch mail from <code>imap.die-welt.net</code> via IMAP:

</p><pre>set imap_user=username

set imap_pass=password

set folder="imaps://imap.die-welt.net/INBOX"

set spoolfile="imaps://imap.die-welt.net/INBOX"</pre>

Now, enable IMAP-IDLE, list subscribed folders, reconnect to the server if needed and mark mail as read when you open it:

<pre>set imap_idle

set imap_check_subscribed

unset imap_passive

unset imap_peek</pre>

Let mutt save sent mail to the Sent directory on the IMAP server, and postponed mail to Drafts:

<pre>set record=+Sent

set postponed=+Drafts</pre>

Read mail should stay where it is:

<pre>set mbox="!"</pre>

We use IMAP-IDLE, thus check for new mail manually only every 90 seconds:

<pre>set mail_check=90</pre>

Instead timeout after 15 seconds if no user input is given:

<pre>set timeout=15</pre>

Set default mail from address to my default mail address:

<pre>set from=evgeni@golov.de</pre>

And send mail via mstmp (see below for mstmp configuration):

<pre>set sendmail="/usr/bin/msmtp"</pre>

Tell mutt which addresses I recieve mail to (danger, ugly regex!):

<pre>alternates (evgeni@(debian.org|golov.(de|eu))|sargentd@(die-welt|sargentd).net|evgeni.golov@uni-duesseldorf.de)</pre>

As mutt knows where I receive mail, let it set From accordingly:

<pre>set reverse_name</pre>

Let mutt cache some stuff and find its certificates:

<pre>set header_cache="~/.mutt/cache/headers"

set message_cachedir="~/.mutt/cache/bodies"

set certificate_file=~/.mutt/certificates

set ssl_ca_certificates_file=/etc/ssl/certs/ca-certificates.crt</pre>

Show only interesting headers in an useful order:

<pre>ignore headers *

unignore headers from to subject date cc

hdr_order from to cc subject date</pre>

Fix stupid MUAs behaviour (e.g. filenames like <code>=?iso-8859-1?Q?file=5F=E4=5F991116=2Ezip?=</code>):

<pre>set rfc2047_parameters</pre>

Beep on new mail, will generate a "!" in the window name in screen:

<pre>set beep_new</pre>

mutt-patched has the great sidebar patch, assign ctrl-n, ctrl-p to select next, prev folder, ctrl-o to open selected folder:

<pre>bind index \Cp sidebar-prev

bind index \Cn sidebar-next

bind index \Co sidebar-open</pre>

And toggle sidebar visibility with ctrl-b:

<pre>macro index \Cb '&lt;enter-command&gt;toggle sidebar_visible&lt;enter&gt;&lt;refresh&gt;'

macro pager \Cb '&lt;enter-command&gt;toggle sidebar_visible&lt;enter&gt;&lt;redraw-screen&gt;'</pre>

Since 1.5.20-2, mutt patched contains <a href="http://www.die-welt.net/2008/11/pimp_my_mutt/">my sidebar-dotted and sidebar-sorted patches</a>.

Let mutt shorten the displayed path (e.g. <code>debian-devel</code> instead of <code>INBOX.ml.debian-devel</code>) and sort the folders (the are returned in random order when using  imap_check_subscribed):

<pre>set sidebar_shortpath

set sidebar_sort</pre>

Now let's set some colors (that match the rest of my "desktop"):

<pre>color sidebar_new yellow default

color normal white default

color hdrdefault brightcyan default

color signature green default

color attachment brightyellow default

color quoted green default

color quoted1 white default

color tilde blue default</pre>

And add some useful macros for marking new and old messages as read:

<pre>macro index .n "&lt;tag-pattern&gt;~N&lt;enter&gt;&lt;tag-prefix&gt;&lt;clear-flag&gt;N&lt;clear-flag&gt;*" "Catchup all new messages"

macro index .o "&lt;tag-pattern&gt;~O&lt;enter&gt;&lt;tag-prefix&gt;&lt;clear-flag&gt;O&lt;clear-flag&gt;*" "Catchup all old messages"</pre>

When forwarding mail, I like it to be forwarded as an attachment (YMMV):

<pre>set mime_forward=yes</pre>

I'm using <a href="http://code.google.com/p/goobook/">goobook</a> in mutt to fetch my addressbook from Google. As there is no Debian package for goobook (yet), you have to install it yourself (via <code>easy_install</code>):

<pre>apt-get install python-argparse python-gdata python-simplejson python-keyring python-nose

easy_install goobook</pre>

Configuration is easy via <code>~/.goobookrc</code>:

<pre>[DEFAULT]

# If not given here, email and password is taken from .netrc using

# machine google.com

email: me@gmail.com

password: password</pre>

And then add the following to your <code>.muttrc</code>:

<pre>set query_command="goobook query '%s'"

bind editor  complete-query

macro index,pager a "&lt;pipe-message&gt;goobook add&lt;return&gt;" "add the sender address to Google contacts"</pre>

That's all for mutt, but...



We are running mutt in a screen, so let's add the following to <code>.screenrc</code> to fix transparency and cut&amp;paste (see <a href="http://wiki.mutt.org/?MuttFaq/Appearance">http://wiki.mutt.org/?MuttFaq/Appearance</a>):

<pre> defbce on

 term screen-bce</pre>

And as mutt uses mstmp (yes, I know, mutt can handle SMTP itself...), this is my <code>.msmtprc</code>:

<pre>defaults

domain dorei.kerker.die-welt.net

tls on



account die-welt.net

host smtp.die-welt.net

from sargentd@die-welt.net

auth on

user username

password password

tls_starttls on

tls_certcheck off



# Set a default account

account default : die-welt.net</pre>

C'est tout! That is my personal mutt configuration, you can download it as one file here: <a href="http://files.die-welt.net/muttrc.txt">my .muttrc</a>. And as everyone loves screenshots, here is one:



<a href="/wp-content/uploads/2011/02/mutt.png"><img title="mutt" src="https://www.die-welt.net/wp-content/uploads/2011/02/mutt-300x171.png" alt="the default view of my mutt" width="300" height="171"></a>



Oh, the next chapter will be about <code>irssi</code>, but not before next Sunday (March 6th) as I'll be offline for a week, skiing in Austria :)</body></html>