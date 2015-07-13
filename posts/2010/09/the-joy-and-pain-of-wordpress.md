<html><body><p>As you may not have noticed, I migrated my site to WordPress some time ago as I did not want to maintain the old piece of crap I wrote myself when I was "young" ;)

Today I want to tell you a story of the development of a plugin for WordPress.



As the title says, it's much about joy and pain and I think I should start with the pain :)



WordPress is written in PHP, so are the plugins for it. And PHP is REAL pain (but there is no decent blogging software for Django or Zope that would fit all my needs). It is especially pain when you work with Python every day. What the heck are those curly braces and dollar signs and "$this-&gt;"? That's just not the way Guido indented it ;)

Additionally my last contacts with PHP were some time back in 2008 when I hacked on <a href="http://www.syscp.org">SysCP</a>, which today result in commits like this:

</p><pre>-        if (is_int($new_instance['max_items'])) $instance['max_items'] = $new_instance['max_items'];

+        if (ctype_digit($new_instance['max_items'])) $instance['max_items'] = $new_instance['max_items'];</pre>

But I have to admit that the WordPress API is pretty good. Not very well documented (the wiki pages at <a href="http://codex.wordpress.org">codex.wordpress.org</a> are sometimes outdated), so you have to read the source and google a bit, but when you found the needed sources, it's pretty straight forward.

My plan was to write a simple widget, displaying my Twitter and identi.ca timelines. Yes, both together, not one widget per service. The reason for this is the fact that I mostly post via identi.ca and the messages get synced over to Twitter and only the local replies and retweets/redents differ.

The basic WordPress widget would look like this (source: <a href="http://codex.wordpress.org/Widget_API#Developing_Widgets_on_2.8.2B">http://codex.wordpress.org/Widget_API#Developing_Widgets_on_2.8.2B</a>):

<pre>class My_Widget extends WP_Widget {

	function My_Widget() {

		// widget actual processes

	}



	function form($instance) {

		// outputs the options form on admin

	}



	function update($new_instance, $old_instance) {

		// processes widget options to be saved

	}



	function widget($args, $instance) {

		// outputs the content of the widget

	}



}

register_widget('My_Widget');</pre>

One only has to modify the widget() function and here you go.



From some other Twitter plugin I knew that I only had to include <code>rss.php</code> and call <code>fetch_rss(url)</code> for every feed URL to get the timelines as an array via MagPie. But when looking at <code>rss.php</code>, you notice the deprecation message in the header, saying one should use SimplePie now. Some google later I knew that I had to include <code>feed.php</code> and call <code>fetch_feed(url)</code> to get a SimplePie object representing the feed contents. But SimplePie is even cooler: I can call <code>fetch_feed(array(url1, url2))</code> and get a merged feed, containing both.

Now I added a duplicate filter to elliminate the messages posted to both, twitter AND identi.ca and my widget was ready.



You can find the result on <a href="http://github.com/evgeni/wp-statusnet-widget">http://github.com/evgeni/wp-statusnet-widget</a> and soon on <a href="http://wordpress.org/extend/plugins/statusnet-widget/">http://wordpress.org/extend/plugins/statusnet-widget/</a> :)</body></html>