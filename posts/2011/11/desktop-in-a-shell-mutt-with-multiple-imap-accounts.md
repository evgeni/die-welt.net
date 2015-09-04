<html><body><p>It's been a long time since my last post about my "<a href="http://www.die-welt.net/category/desktop-in-a-shell/">desktop in a shell</a>", but today I stumbled over something absolutely awesome I want to share with you.

A bit of background: I am using <a href="http://www.die-welt.net/2011/02/desktop-in-a-shell-mutt/">mutt</a> with a single imap server (where everything is forwarded to), because I disliked the idea of having multiple mutt instances running and did not want to play the "<code>&lt;change-folder&gt;imaps://other.server.tld/&lt;enter&gt;</code>" game too much.

Now today I had to delete some mail from an account I don't use regularly (and where the webmail sucks), so I switched my screen to mutt and actually did the <code>&lt;change-folder&gt;</code> game and was like wow... because the account showed up in my sidebar and I could just jump between the folders of both accounts.

So I thought how to automate this, so I could actually use mutt with multiple accounts (without offline-imap and friends, which is what you find on the web).

It's damn easy:

</p><pre># muttrc

set imap_user=account1

set imap_pass=password

set folder="imaps://imap.one.example.com/INBOX"

set spoolfile="imaps://imap.one.example.com/INBOX"

...

push &lt;change-folder&gt;imaps://account2@imap.two.example.com/&lt;enter&gt;</pre>

Well, what does this do? It advises mutt to use <code>imap.one.example.com</code>, but then just jumps to <code>imap.two.example.com</code> at the end of the config, resulting in both accounts being loaded into the sidebar and usable. That's it, one line and it is awesome!

Please note, the password to both accounts is the same, you will have to fiddle around and put it in the URL somehow if it differs.</body></html>