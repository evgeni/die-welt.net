<html><body><p>Did not exist.

Will never exist.

There was quite a lot of buzz about privacy with that new IPv6 thingy. Some say it is bad, as you will have a static address. Some say the privacy extensions will fix everything. I say: lemme rant ;)

First of all, that was the internet, when I started using it back in 1999:

</p><p style="text-align: center;"><a href="http://en.wikipedia.org/wiki/On_the_Internet,_nobody_knows_you're_a_dog"><img class="aligncenter" src="http://upload.wikimedia.org/wikipedia/en/f/f8/Internet_dog.jpg" alt=" [© New Yorker Magazine, March 1993] On the Internet nobody knows that you are a dog'"></a>

[© New Yorker Magazine, March 1993] On the Internet nobody knows that you are a dog'</p>

And that's the internet today:

<p style="text-align: center;"><a href="http://www.robcottingham.ca/cartoon/archive/your-friend-just-sniffed-you-sniff-back-yn/"><img class="aligncenter" src="http://www.robcottingham.ca/cartoon/wp-content/webcomic/noise-to-signal/2010.05.14.dog.png" alt="robcottingham.ca - How the hell does Facebook know I'm a dog?" width="500" height="550">

</a>[© robcottingham.ca] How the hell does Facebook know I'm a dog?</p>

<p style="text-align: left;">Well, I'd say that's not correct. Even in 1999 facebook <strong>could</strong> know you are a dog (if you ignore the fact, that there was no facebook in 1999), it's just noone really cared about it. But let's start from the beginning :)</p>

<h1>An IP-address is a 32-bit integer</h1>

<p style="text-align: left;">An IP-address is technically a 32-bit integer, formatted into 4 8-bit parts (you can read more about IPv4 at <a href="http://en.wikipedia.org/wiki/IPv4">Wikipedia</a>), which makes a total of 4,294,967,296 possible IP-addresses. Your ISP has a range in this "address-space" it can give to its customers (you). My ISP (Unitymedia) "owns" about 300,000 IP-addresses (based on <a href="http://www.db.ripe.net/whois?searchtext=UNITYMEDIA-MNT&amp;inverse_attributes=mnt-by&amp;form_type=simple">the RIPE database</a>), which is about 0.007% of the whole address-space. If you look at the RIPE page, you see two common netname prefixes (DE-KNRW and ﻿DE-IESY-HFC) which match two regions of Germany where my ISP has its customers (Unitymedia is a merge of ish and iesy). What does that mean? It means one can map a Unitymedia customer into one of these regions, even if he would change his IP-address (Unitymedia uses DHCP with high lease-times, so this does not happen actually). It does not map the customer to a dog yet, but I bet real GeoIP databases can map them correctly to a city (I didn't try much, but this site suggests it works: <a href="http://www.ip-adress.com/?lc=en">http://www.ip-adress.com/?lc=en</a> - at least they map me correctly to Duesseldorf).</p>

<h1>Dynamic IP-addresses do not improve privacy</h1>

<p style="text-align: left;">Given the above facts, even if Unitymedia would give me a new IP-address every X hours (many DSL-providers have X=24), it is still possible to map me into a set of about 150,000 "users" (here user means customer, there still may be multiple computers connected via the same line). I would even go further and say the set is much smaller, as I think I am not able to get every "free" IP-address from DE-KNRW-*, as these should be bound to cities/regions (GeoIP databases exist, you rememember?) and I do not move with my line.</p>

<h1>Routers and reverse DNS kill privacy</h1>

<p style="text-align: left;">Currently, "my" IP-address is 62.143.232.104, which has a reverse DNS entry ﻿ip-62-143-232-104.unitymediagroup.de and does not say anything about me or my location, besides of the obvious "Unitymedia customer". But look at the traceroute:</p>

<pre>4  7111A-MX960-01-ae5.frankfurt.unity-media.net (80.81.192.181)

5  13NOC-MX960-01-ae8.kerpen.unity-media.net (80.69.107.26)

6  1411G-MX960-01-ae9.neuss.unity-media.net (80.69.107.2)

7  1411J-MX960-01-ae1.bilk.unity-media.net (80.69.107.70)

8  PH-1411J-uBR10k-06-Te-1-2-0.bilk.unity-media.net (80.69.102.106)</pre>

Frankfurt is about 250km from here, Kerpen about 60, Neuss about 10 and Bilk is a part of the city I live in, about 4km away from my home. I guess you get the idea :)

<h1>Browsers kill privacy too</h1>

Do I have to say more than a link to <a href="https://panopticlick.eff.org/">https://panopticlick.eff.org/</a>? My Chromium scores one in 1,400,000. How much IP-addresses did I have to hide in again?

We are at the dog level now, dogs use BoneOS with FireBark, not Linux with Chromium :)

<h1>IPv6 kills cute kittens</h1>

Oh, and privacy, because with IPv6, there are 2^128 IPv6-addresses out there, of which your provider will maybe own a /32 (2^96 addresses) and give you a /48 (2^80 addresses) or (more likely) /64 (2^64 addresses). Then you enable the great IPv6 privacy extensions (<a href="http://tools.ietf.org/html/rfc4941">RFC4941</a>) and happily hide in your own assigned subnet, still being a customer of your ISP, still living in the same city and using your old browser... It's just about mapping subnets instead of individual IP-addresses then. And we can't get lower as the dog level

<h1>People can annoy me</h1>

I did not write all this to teach you, you can do yourself with Wikipedia and RFCs. There is a person out there, who thinks using a random name, mail address and twitter account could fool me into thinking that's a new, yet unknown, person to me. Well, I am not stupid, sorry. When you comment on my blog, your IP-address is logged, when I approve the comment, I often look at the reverse DNS and the whois entry of that IP-address (sorry, I <strong>AM</strong> paranoid). I even might check my webserver logs (or Piwik) where did you come from (Google etc), writing "accidentally" in your comment does not help :) Also, if you are trying to fool me, don't use your own computer, running Windows 7 and Firefox which <strong>I</strong> installed. Oh, and probably do not use your home line which I used to login into my admin-area using my unique Chromium ;)

Sorry Hanna Lena, the chicken has just eaten her own eggs...

And yes, one can track down a single person on this big thing called internet, IPv6 will not change this (in any direction).</body></html>