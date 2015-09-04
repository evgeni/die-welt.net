<html><body><p>i can haz understanding?

I'm trying to rebuild a package with gcc-4.6 instead of (default) gcc-4.5. Sounds easy, huh?

Not today, not with qmake :(

Setting <code>CC=gcc-4.6 CXX=g++-4.6</code> on the command-line does not help. Neither does exporting these in debian/rules. Let's fire up Google, I think I remember qmake tends to prepend EVERYTHING with <code>QMAKE_</code>... Right, <a href="http://doc.trolltech.com/4.6/qmake-variable-reference.html">official documentation says</a> it's <code>QMAKE_CC</code> and <code>QMAKE_CXX</code>. Setting those on the command-line does ... not help. <code>debian/rules</code>? Nope!

Okay, let's do it the qmake-way, set it in the main .pro file which basically just calls a bunch of other .pro files (one for each component of the project). Guess what? It does not help. You have to set these in each and every .pro file! Rly? Is this what I have a build-system for?

<strong>&lt;/rant&gt;</strong>

Now, seriously, what's the proper way to override stuff like this in qmake? Any pointers appreciated.</p></body></html>