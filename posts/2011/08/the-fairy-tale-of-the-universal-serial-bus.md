<html><body><p>So I own some machines with that <a href="http://debian.org">Universal OS</a> on them and had to create a bunch (300) identical USB-keys (with the <a href="http://ubuntu.com">not so universal daughter OS</a>).



Doesn't sound too complicated, huh? Buy 300 USB-keys, create one by hand, <code>dd</code> that over the 299 others. To make life easier, add some USB-hubs to the mix. Well, I will drop the part how to use dd to make identical copies of USB-keys and just list the lessons learned:

</p><ol>

<li>The regular USB-key is some millimeters wider than a standardized USB-plug and almost all manufactors of USB-hubs place the ports in a way that there is exactly no space between the plugs. Yes, that means that you cannot plug two USB-keys in two neighboring ports of the hub then.</li>

<li>There is NO way to get a USB-hub for below 10€ here in Düsseldorf, and if you do...</li>

<li>HiSpeed USB 2.0 does NOT mean the hub will actually work as a USB 2.0 hub with 480Mbit/s, but as USB 1.1 with 12MBit/s</li>

<li>If you happen to own a Cherry keyboard with an integrated USB hub, it's most probably USB 1.1 too :/</li>

<li>When you buy 300 USB-keys, don't expect them to be identical, about 100 of them are 3MiB smaller than the other 200, and we created the initial image on one of the "big" ones of course.</li>

</ol>

<div>That's all for now: &lt;/rant&gt;</div>

<div>Thanks go out to <a href="http://transcend-info.com/">Transcend</a>, <a href="http://www.kmelektronik.de">K&amp;M Elektronik</a>, some cheap chinese USB-hub manufactor, <a href="http://conrad.de">Conrad Elektronik</a> and <a href="http://mediamarkt.de">MediaMarkt</a>.</div></body></html>