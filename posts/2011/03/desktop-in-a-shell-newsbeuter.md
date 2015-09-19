<html><body><p>Another week, another post from my <a href="https://www.die-welt.net/2011/02/desktop-in-a-shell/">desktop in a shell</a> series. This time: <code>newsbeuter</code>, my RSS/Atom/whatever feed-reader of choice.

Newsbeuter is a config-and-forget kind of tool. You only have to touch it when you change from a static <code>~/.newsbeuter/urls</code> to Google Reader or something (like I did some time ago). In the following I will explain both ways (as both are short and it would not fill a whole post then *g*).

</p><h2>newsbeuter with a static urls file</h2>
First you create a <code>~/.newsbeuter/urls</code> with all your feed URLs (one per line). Then you already can start newsbeuter and it will "just work". But you also can customize it (<a href="http://newsbeuter.org/doc/newsbeuter.html#id462991">see newsbeuter's online doc</a>) by writing a <code>~/.newsbeuter/config</code>. Mine was rather short:

<pre> auto-reload yes
 refresh-on-startup yes
 goto-next-feed no</pre>

Which means newsbeuter will refresh the feeds every 60 minutes (tuneable via <code>reload-time</code>) and on startup and won't jump to the next feed when pressing <i>n</i> in a feed which has no unread items.

Yes, sorry, this is all. Newsbeuter just works ;)

<h2>newsbeuter with Google Reader</h2>
Want to use newsbeuter with your Google Reader account? Add

<pre> urls-source "googlereader"
 googlereader-login "you@gmail.com"
 googlereader-password "password"</pre>

to your <code>~/.newsbeuter/config</code> and it works :)

Most people want to add <code>googlereader-show-special-feeds no</code> as they do not care about Google's suggestions etc.

The only culprit here is than one has to use Google Reader to subscribe to feeds, as newsbeuter does not support this (it's a viewer only).

Oh, and here comes the screenshot you waited for:

<a href="/wp-content/uploads/2011/03/newsbeuter.png"><img src="/wp-content/uploads/2011/03/newsbeuter-300x171.png" alt="" title="newsbeuter" width="300" height="171" class="alignnone size-medium wp-image-874"></a>

And no, I do not post my config here, you have to copy-paste it from above, hard, isn't it? :)</body></html>
