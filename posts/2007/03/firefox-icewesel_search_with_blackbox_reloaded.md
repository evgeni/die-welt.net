<html><body><p>Everybody knows, that Google isn't evil, but they still collect some data and stuff, so people dislike it. But Google also gives the best results for searches. So what to do? Yeah, use BlackBoxSearch (by the way, nobody said, they are not evil too...). But there is some uncomfortability: I do not like to go to some website to do a search and I do not like to use the Firefox^WIceweasel search box in the right corner either - it's just too far away from the address-bar. Yepp, I usually use the address-bar for searches, just type some keywords in at it redirects you to Google. But I wanted BlackBox - what to do?<br>

<br>

It is quite easy - but it took some time to figure out, that the right config string is keyword.URL - nothing with "search" or "google" in it.<br>

So just open <strong>about:config</strong> in your Firefox^WIceweasel and search for <strong>keyword.URL</strong>. It should be set to something like "http://www.google.com/search?ie=UTF-8&amp;oe=UTF-8&amp;sourceid=navclient&amp;gfns=1&amp;q=", so we change it to <strong>http://www.blackboxsearch.com/cgi-bin/searchGoogle.cgi?q=</strong> et voila - after typing some random shit into the address-bar, we get results from Google proxied through BlackBox.<br>

<br>

Yay for teh non-evilness!<br>

<br>

PS: When you read <a href="http://www.google-watch.org">http://www.google-watch.org</a> - never forget to read <a href="http://www.google-watch-watch.org/">http://www.google-watch-watch.org/</a> ;-)</p></body></html>