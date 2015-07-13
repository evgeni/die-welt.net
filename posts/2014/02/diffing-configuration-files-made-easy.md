<html><body><p>Let's assume you are a sysadmin and have to debug a daemon giving bad performance on one machine, but not on the other. Of course, you did not setup either machine, have only basic knowledge of the said daemon and would really love to watch that awesome piece of cinematographic art with a bunch of friends and a couple of beers. So it's like every day, right?</p>



<p>The problem with understanding running setups is that you often have to read configuration files. And when reading one is not enough, you have to compare two or more of them. Suddenly, a wild problem occurs: order and indentation do not matter (unless they do), comments are often just beautiful noise and why the hell did "that guy" smoke/drink/eat while explicitly setting ALL THE OPTIONS to their defaults before actually setting them as he wanted.</p>



<p>If you are using <a href="https://www.gnu.org/software/diffutils/"><code>diff(1)</code></a>, you probably love to read a lot of differences, which are none in reality. Want an example?</p>



<p>[foo]<br>

   bar = bar<br>

   foo = foo</p>



<p>and</p>



<p># settings for foo<br>

   [foo]<br>

   # foo is best<br>

   foo = foo<br>

   # bar is ok here, FIXME?<br>

   bar = bar</p>



<p>and</p>



<p>[foo]<br>

   foo = x<br>

   bar = x<br></p>



<p>[foo]<br>

   foo = foo<br>

   bar = bar</p>



<p>are actually the same, at least for some parsers. <a href="http://noone.org/blog">XTaran</a> suggested using something like <a href="https://www.gnu.org/software/wdiff/"><code>wdiff</code></a> or <a href="http://os.ghalkes.nl/dwdiff.html"><code>dwdiff</code></a>, which often helps, but not in the above case. Others suggested <a href="http://vimdoc.sourceforge.net/htmldoc/diff.html"><code>vimdiff</code></a>, which is nice, but not really helpful here either.</p>



<p>As there is a problem, and I love to solve these, I started a small new project: <a href="https://github.com/evgeni/cfgdiff"><code>cfgdiff</code></a>. It tries to parse two given files and give a diff of the content after normalizing it (merging duplicate keys, sorting keys, ignoring comments and blank lines, you name it). Currently it can parse various INI files, JSON, YAML and XML. That's probably not enough to be the single diff tool for configuration files, but it is quite a nice start. And you can extend it, of course ;)</p>

</body></html>