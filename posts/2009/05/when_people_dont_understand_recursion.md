<html><body><p>While drinking my coffee, I stumbled over <a href="http://www.longurlplease.com/">http://www.longurlplease.com/</a> on <a href="http://www.golem.de/0905/67400.html">Golem.de</a> (sorry, it's German).<br>

<br>

They say, that when you get a shortened URL, you<br>

</p><ul><li>have no idea where it links to</li><li>are unaware you've been there</li><li>may secretly linked to yucky websites</li></ul><br>

That sounds correct, esp with the "funny" "new" ideas of the German government about blocking sites with 'Kinder"pornographie"' (sorry for the German again, and for the multi-quotes, but they say I have to call it like this...) and recording those who try to access such sites.<br>

<br>

Anyways, that great service over at longurlplease.com will make the world a safer place:<br>

<ul><li>You see you've been there before</li><li>Tell it links to youtube</li><li>More information before you click</li></ul><br>

(the lists are copied from their site, without care about proper rewording for my context)<br>

<br>

Sounds great, huh? And they even support 65 different shorturl services. But lets see how they support the same service twice in a row (should be easy too, right?).<br>

<br>

<ol><li>Go to http://tinyurl.com/</li><li>Create a shorturl for http://gpl.imageafter.com/ (= http://tinyurl.com/oae8sx)</li><li>Go to http://tinyurl.com/</li><li>Create a shorturl for http://tinyurl.com/oae8sx (= http://tinyurl.com/r6n74h)</li><li>Ask the longurlplease.com API about http://tinyurl.com/r6n74h (<i>curl "http://www.longurlplease.com/api/v1.1?q=http://tinyurl.com/r6n74h"</i>)</li><li>See <strong>{"http:\/\/tinyurl.com\/r6n74h": "http:\/\/tinyurl.com\/oae8sx"}</strong> as result</li><li>Laugh and spread double-shortened Rick-Rolls (people will love you!)</li></ol><br>

<br>

That makes the whole service somehow useless, as you gain exactly nothing, and tell longurlplease.com about each shorturl that comes to your browser (if you have the Firefox plugin installed).<br>

<br>

On the other hand, the creator could easily add a recursive resolver, but I bet he (or she? or they?) won't do that, when one does not want the service to die completely in a endless loop (I don't have a black hat, neither I have a white one - I actually don't like hats at all, but it should be possible to construct some funny redirection loops with such services).<br>

<br>

<strong>Update:</strong><br>

It seems tinyurl.com was intelligent and changed that behaviour now:<br>

<i>Error: TinyURL redirects to a TinyURL.<br>

The URL you followed redirects back to a TinyURL and therefore we can't directly send you to the site. The URL it redirects to is http://tinyurl.com/oae8sx.</i><br>

<br>

But one still can fake this:<br>

http://ow.ly/9Arf -&gt; http://tinyurl.com/oae8sx -&gt; http://gpl.imageafter.com/</body></html>