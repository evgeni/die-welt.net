<html><body><p>I think, almost everybody, who has an AMD/ATI graphics card, has <a href="http://www.phoronix.com/vr.php?view=11058" target="_blank">already heard</a> about the new <a href="http://gitweb.freedesktop.org/?p=xorg/driver/xf86-video-radeonhd" target="_blank">RadeonHD Linux Driver</a>, but not everyone has already tested it.<br>

For my part I'm testing since yesterday and the whole thing is growing very fast, however I do not yet have a proper output on my Mobility Radeon X1400. But this is not what I wanted to write here, I wanted to write how to help the developers.<br>

<br>

<strong>IMPORTANT!</strong><br>

First you need to send some beer, some peanuts and maybe also some money to libv (#radeonhd on freenode), then he might start looking on your reports *g* - sorry libv ;) just kiddin too ;)<br>

<br>

<strong>1. get the driver</strong><br>

As the driver is in a very early stage of development, changes are made every day and packages from your distribution (well, I only know that <a href="http://packages.debian.org/experimental/xserver-xorg-video-radeonhd" target="_blank">Debian</a> has it in it's repositories) is maybe outdated at the time of uploading by the maintainer, so please build it from git, as perfectly <a href="http://www.phoronix.com/scan.php?page=article&amp;item=843&amp;num=1" taget="_blank">described here at phoronix</a>.<br>

<br>

<strong>2. test the driver</strong><br>

a) You get a picture when starting X with the radeonhd driver? Feel lucky and maybe write an email to radeonhd@opensuse.org, telling the guys how much you love them, and what card works for you.<br>

b) You get a black screen, but X has properly started? The driver has correctly recognized your card, but had problems to set-up correctly, please read on.<br>

c) You get an error in your log, and no X? That might have several reasons, let's look in your log. Does it state something like<br>

<br>

<i>(WW) RADEONHD(0): Unknown card detected: 0x1234:0x1234:0x1234 (imagine some other numbers here)<br>

...<br>

(EE) RADEONHD(0): Cannot map connectors on an unknown card!</i><br>

<br>

If so, your card could not be recognized, as every vendor (ASUS, Gecube, etc) might give the card a slightly different subsystem id, which is not yet known to the driver. Please have a look at <strong>reporting card info</strong>, so your card can soon be added to the driver.<br>

Or do you probably get something like<br>

<br>

<i>(EE) RADEONHD(0): No valid modes found</i>?<br>

<br>

This should happen, when the driver could not get enough/correct information, what mode you monitor wants to run with, this does lead to the previously described black screen too (as I get it here at the moment). I do not think this should be reported at the moment, as the problem is known to the developers.<br>

<br>

<strong>3. reporting card info</strong><br>

When you decide to report something (which is the real help-part here), you should do it correctly.<br>

First you should describe what card do you have (not only Radeon X1950, but ASUS FunkyNameOnTheBox Radeon X1950), and what result do you get (working X, not working X, X not finding something, etc).<br>

Then attach your logfile (usually it's /var/log/Xorg.0.log), but don't forget to compress it before, this really saves traffic.<br>

The last one is probably the most important one: the conntest output (see below).<br>

<br>

<strong>4. conntest</strong><br>

conntest is a small tool which probes the connectors of the video card.<br>

You can find it in utils/conntest/ in git, and build it just by calling make (dont forget to install pciutils-dev).<br>

The you call it with <strong>./rhd_conntest &lt;pci tag&gt;</strong> as root, where &lt;pci tag&gt; is the number <strong>lspci</strong> shows you in front of the name of your card - usually it is 01:00.0<br>

But you should not run it just once, but for every output your card have.<br>

On a laptop it's usualy once with nothing attached (only internal screen is active), and once with a screen connected to the VGA port.<br>

If your laptop has a DVI and not a VGA connector, please run rhd_conntest once for a analog screen connected through an DVI-VGA adapter, and once for a digital DVI-connected screen.<br>

On a desktop, you would call it once for NO screens connected, and then same as for a laptop: once with a analog screen on each VGA connector and then once with an analog screen with a DVI-VGA adapter and once with a digital screen on each DVI connector.<br>

Have a look at the README in the same dir, it describes everything a bit more.<br>

<br>

As soon as you have all the data you want to share, send the mail to radeonhd@opensuse.org and wait for a reply.<br>

<br>

I hope this can help somebody to get his card working with RadeonHD</p></body></html>