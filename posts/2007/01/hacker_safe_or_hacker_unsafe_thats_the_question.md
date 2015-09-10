<html><body><p>As you might know, Cross-Site-Scripting (aka XSS) is a very evil thing, and can be used for several attacks, like phishing, DDoS, trojan/spyware/malware distribution and &lt;insert evil thingie here&gt;.<br>
Today I've seen a link to <a href="http://www.costcentral.com">http://www.costcentral.com</a>, someone on the thinkpad-mailinglist has posted it. Just for fun I clicked and looked at the item (a ThinkPad USB keyboard). Nothing evil until yet, the link wasn't crafted and the item was okay, but then I discovered this nice "<a href="http://www.scanalert.com" target="_blank">ScanAlert - Hacker Safe</a>" logo (if you clicked the link and wonder why Firefox^WIceweasel does not show anything in the title: the guys forgot the &lt;title&gt;-tag ;-)). You might ask now: "Hacker Safe"? WTF!? (or maybe *ROFL*? I was like o_O).<br>
A sentence from their about-page describes the situation:<br>
<strong>"Tens of thousands of organizations from small non-profits to FORTUNE 500 multinationals rely on ScanAlert to protect, audit and certify the security of their networks and ecommerce infrastructure."</strong><br>
<br>
They do security? I do too... So let's test ;-)<br>
A click on "hacker safe sites" gave me a list of sites. Uh, did I just read NetGear there? Didn't I have discovered some XSS in there sites a month ago? True, but the link goes to the shop of NetGear, which seems okay on the first view (didn't look another time, there was much more fun later).<br>
<br>
So here we have six nice XSS links, two in the newsletter form, four in the search one. How people can still be so stupid?!<br>
<br>
<a href="http://www.yankeecandle.com/cgi-bin/ycbvp/emailOptIn.jsp?email=%3Ch1%3EH4x0R_s4F3?%3C/h1%3E&amp;wantMessage=1&amp;submit.x=1&amp;submit.y=1" target="blank">yankeecandle.com newsletter XSS</a><br>
<a href="http://store.babycenter.com/p2p/basicSearch.do?keyword=%3Ch1%3Ehagg0r%20zafe?%3C/h1%3E&amp;Search.x=0&amp;Search.y=0" target="blank">store.babycenter.com search XSS</a><br>
<a href="http://www.guitarcenter.com/subscribe/subscribe.cfm?email=%22%3E%3Ch1%3ESAF0R?%3C/h1%3E" target="blank">guitarcenter.com newsletter XSS</a><br>
<a href="http://www.fortunoff.com/find.asp?textsearchname=0desc&amp;textsearchvalue=%3Ch1%3Ehacker?%3C/h1%3E&amp;samesearch=1" target="blank">fortunoff.com search XSS</a><br>
<a href="http://www.bhphotovideo.com/bnh/controller/home?ci=1&amp;sb=ps&amp;pn=1&amp;sq=desc&amp;InitialSearch=yes&amp;O=productlist.jsp&amp;A=search&amp;Q=*&amp;bhs=t&amp;shs=--%3E%3C/script%3E%3Ch1%3Esekkure???%3C/h1%3E&amp;image.x=0&amp;image.y=0" target="blank">bhphotovideo.com search XSS</a> (this one was actually funny, the DID protect the data almost everywhere, but not inside one small javascript -&gt; sucks)<br>
<a href="http://search.pacsun.com/?query=%22%3E%3Ch1%3Eseggure!?%3C/h1%3E" target="blank">search.pacsun.com search XSS</a><br>
<br>
So what do we have? Six sites with XSS, discovered (instead of doing some university stuff) in about half an hour. And those sites should be hacker safe? Says a company doing its job since 2001? May I just give a loud laugh and go to bed with my girlfriend? Yeah maybe I should, but instead I whine about this poor security on the web of today. Is it InSecurity 2.0?<br>
<br>
Guys, please read <a href="http://www.heise.de/security/artikel/84149" target="blank">THIS article about web security at heise.de</a> (sorry, it's in German) or just change the job!</p></body></html>