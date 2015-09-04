<html><body><p>So I got SVN access to plugins.svn.wordpress.org, but I hate SVN. Let's just use Git instead of SVN, especially when I already have my plugin as Git on github.com :)

</p><pre>git svn clone -s -r283636 https://plugins.svn.wordpress.org/statusnet-widget/

git remote add -f github git://github.com/evgeni/wp-statusnet-widget.git

git merge github/master

git svn dcommit</pre>

(note the -r283636 - it's very important, if you ommit it, git svn will fetch 280k revisions which takes ages, if you put it to something AFTER your repo was created, the log will be b0rked*)

Done! Now you can work as usual, <code>push</code> to github and commit to svn via <code>dcommit</code> :)

PS: Dear WordPress.org Team, you have working SSL, why do you still have http-links in your mails?

*: You can find the revision you need by looking at <a href="http://plugins.trac.wordpress.org/log/statusnet-widget/">http://plugins.trac.wordpress.org/log/statusnet-widget/</a> - you need the one when plugin-master created your repo :)

Thanks nplus for reminding me about this on XMPP :)</body></html>