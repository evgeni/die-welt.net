<html><body><p>Uh, yeah, I did it :)<br>
I patched my mutt-patched :)<br>
<br>
You may ask why I did it, and what I did, so here we go:<br>
I use mutt(-patched) on my Etch box to read and write mail when I'm not in front of my regular box, where I use sylpheed.<br>
My mail is stored on an IMAP server (courier, actually it's the same box you retrieve this website from), so I use mutt's imap support (don't tell me about offlineimap and stuff, I know them).<br>
Having multiple folders on the IMAP server, you really want to use the sidebar patch for mutt, or you'll get crazy.<br>
<br>
But here start my problems. The sidebar patch does not understand, that IMAP often uses a dot (<strong>.</strong>) instead of a slash (<strong>/</strong>) as a delimiter between the folders.<br>
Thus the sidebar will look like this:<br>
</p><pre>INBOX<br>
INBOX.Sent<br>
INBOX.Drafts<br>
INBOX.foo<br>
INBOX.bar<br>
INBOX.bar.baz<br>
INBOX.bar.baz.archive<br>
...</pre><br>
<br>
Looks quite bad, especially when you have deep hierarchies. So I wrote the first patch, <strong>sidebar-dotted</strong>, which makes the sidebar look like this:<br>
<pre>INBOX<br>
 Sent<br>
 Drafts<br>
 foo<br>
 bar<br>
  baz<br>
   archive</pre><br>
<br>
Better, huh? Oh, if you want to see this, you'll need to <strong>set sidebar_shortpath</strong> ;)<br>
<br>
But this is still not as good as I want it, because I get something like this:<br>
<pre>foo<br>
  baz<br>
   archive<br>
 bar<br>
INBOX<br>
 Drafts<br>
 Sent</pre><br>
<br>
Wonder why? I have <strong>imap_check_subscribed</strong> enabled, so I don't have to list all the folders via <strong>mailboxes</strong>, but the server returns the subscribed folders unsorted and you see the result :(<br>
<br>
Here I came up with the second patch, <strong>sidebar-sorted</strong>, enable it with <strong>set sidebar-sort</strong> and you get a nice folder listing as you (<strong>I</strong>) wanted.<br>
<br>
You want the patches? Get them <a href="http://files.die-welt.net/mutt/">in the original version</a> or better, the <a href="http://anonscm.debian.org/gitweb/?p=pkg-mutt/mutt.git;a=tree;f=debian/patches/mutt-patched">updated by the Debian community</a> one.<br>
Have fun with them, and forgive me, if mutt's fleas will eat up your mail :)</body></html>