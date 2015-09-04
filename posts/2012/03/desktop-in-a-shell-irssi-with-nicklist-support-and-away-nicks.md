<html><body><p>Yesterday I finally got my girlfriend to switch from X-Chat to irssi.

Well, she actually switched herself as she wanted to have a persistent backlog and the ability to connect to it from everywhere.

Setup was easy and painless, but she missed one feature of X-Chat, the nicklist on the right.

That's easy: <code>/script load nicklist</code> and <code>/nicklist screen</code> and done, huh?

But X-Chat's nicklist does not only list the nicks and their modes but also indicates whether the person is away or not.

<a href="http://wouter.coekaerts.be/irssi/nicklist">irssi's nicklist.pl</a> does not support that.

Well, <strong>did</strong> not support. Some unspeakable words about Perl later I had it working. At least sort of. I am not satisfied with the result yet. irssi saves the away status of the person in the <code>gone</code> attribute of the nick. But it seems not to be updated regularly but only when you do a <code>/WHO</code> to the nick or a channel he is in.

To solve this, I currently issue a <code>/WHO</code> every time someone joins the active channel plus every 5 minutes, again, only for the active channel. This means you might miss updates in channels you don't have open frequently but you also do not spam the IRCd too much. Better solution anyone? I'd prefer not to have an own list of channels and nicks somewhere with "last updated" timestamps.

Get <a href="http://files.die-welt.net/irssi/nicklist-away.patch">the diff against the latest upstream version</a> or a <a href="http://files.die-welt.net/irssi/nicklist-away.pl">fully patched file</a> here and throw me your (better) solutions!</p></body></html>