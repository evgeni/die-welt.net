<html><body><p>If you do not play <a href="http://pokerth.net">PokerTH</a> yet, you might want give it <a href="http://packages.debian.org/pokerth">a try</a> :)

If you already do, read on :)

</p><h2>PokerTH 0.8</h2>

PokerTH 0.8 was released a couple of days ago. The most exciting feature of this new release is the online ranking feature: you can register at <a href="http://www.poker-heroes.com/">poker-heroes.com</a> and login with these credentials in PokerTH, now your games will be logged and you might reach place 1 at the <a href="http://www.poker-heroes.com/ranking.html">ranking site</a>.

However, you won't see 0.8 if you do not have experimental (for Debian) or the <a href="https://launchpad.net/~pkg-games/+archive/ppa">pkg-games PPA</a> (for Ubuntu) in your sources.list. As the release is only a few days old, it won't be included in Squeeze or Maverick. Sorry for that. But I plan to provide needed backports as soon they are needed (currently experimental and PPA should be sufficient, tell me if they are not).

<h2>PokerTH 0.7.1</h2>

As written above, 0.8 won't be shipped in Squeeze and Maverick, but 0.7.1 will be. With the release of 0.8, upstream has moved their server to 0.8. This means that Debian and Ubuntu users won't be able to play internet games on the official server (as long they did not install 0.8). I've set up <code>pokerth.debian.net</code> running 0.7.1 and have just uploaded 0.7.1-2 which uses this server as default one to unstable (sync to Maverick will follow in a couple of hours). However, default means default on new installs. If you have already played PokerTH, you have a <code>~/.pokerth/config.xml</code> with the upstream server in it and you have to change this if you want to play on my server. Please read <code>/usr/share/doc/pokerth/NEWS.Debian.gz</code> for this:

<pre>﻿﻿pokerth (0.7.1-2) unstable; urgency=low

  The server at PokerTH.net now runs the 0.8 version of the software,

  which is incompatible with 0.7.x we ship in Squeeze.

  Because of that a 0.7.x server is running on pokerth.debian.net.

  On new installations this will be the default server used.

  On old ones you have to reconfigure your client yourself.

  Either set "Serverlist Address" under Settings → Internet Game to

  "pokerth.debian.net/serverlist.xml.z" or use the "Manual Server

  Configuration" using "pokerth.debian.net" as the server address.

 -- Evgeni Golov  &lt;evgeni@debian.org&gt; Mon, 27 Sep 2010 14:09:17 +0200</pre>

Sorry for that and enjoy nice flops and raises :)</body></html>