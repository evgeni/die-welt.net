<html><body><p>At the moment, I'm doing much stuff in <a href="http://en.wikipedia.org/wiki/LaTeX" target="_blank">LaTeX</a> for my study. And <a href="http://kile.sourceforge.net/" target="_blank">Kile</a> seems to be the editor of choice here.<br>
But there is one bad thing with Kile, it's a KDE-app, which behaves - well - KDEish :(<br>
<br>
Today I wanted to enable spell checking in Kile, which should support <strong>aspell</strong> and <strong>ispell</strong>. As aspell was already installed on my system, I assumed, it would "just work". But clicking <strong>Tools &gt; Spelling</strong> just gave me<br>
"The spelling program could not be started. Please make sure you have set the correct spelling program and that it is properly configured and in your PATH."<br>
Aspell is in my PATH and works perfectly for all the other apps (Gajim, Sylpheed, XChat).<br>
<br>
So I started googling for a solution. It looked like Kile was defaulting to ispell, and you could set it to aspell in <strong>kcontrol</strong>.<br>
My system runs Xfce, so no kcontrol for me (I could install it, but who wants this KDE-stuff?).<br>
So there seem to be two solutions for me:<br>
1. Install ispell (what I don't want, why having multiple spell-checkers installed?)<br>
2. ln -s /usr/bin/aspell /usr/local/bin/ispell (yeah, that works, as aspell is a drop-in replacement for ispell)<br>
<br>
But wait, where is the <strong>how not to make a website</strong> part? Here it is:<br>
On my journey, I found this blog-post: http://andrewjpage.com/index.php?/archives/93-IASpell-could-not-be-started-in-Kile.html (yes, not linked). Running Iceweasel with AdBlock, the page looked like:<br>
<img src="/upload/stupid_block.png" alt="/upload/stupid_block.png"><br>
Wtf?! I'm not allowed to see the content, just because I block stupid ads?</p></body></html>