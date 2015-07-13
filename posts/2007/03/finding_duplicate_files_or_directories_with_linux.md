<html><body><p>I think everybody knows this situation: the collection of $FOO has grown over the years and you may have some duplicates in it. Even disk space isn't very expensive anymore, the fact of having duplicates annoys me. So today I had some spare time and started cleaning up my drives. In directories with 20 or 30 items this is quite easy, but what is when you have a directory with 1500 items? Ask your favorite shell, but before you can do this, you need to look up a regex-pattern which matches the usual naming sheme. I usually have $FOO-$BAR-some-shit or $FOO_-_$BAR-some-shit and $FOO and $BAR are the only interesting information. Because of this, my pattern looks like <strong>([a-zA-Z0-9]*)-([a-zA-Z0-9]*).*</strong> - I have to groups of alphanumerical-stuff, divided by a hyphen and do not care for the rest.<br>

<br>

But I still do not know, where my duplicates are, so I ask my favorite tools: my shell (zsh, but this works with every POSIX-shell), sed and uniq:<br>

<br>

<strong>ls /foo | sed -e 's#[^a-zA-Z0-9-]##g;s#\([a-zA-Z0-9]*\)-\([a-zA-Z0-9]*\).*#\1-\2#' | uniq -id</strong><br>

<br>

This lists the contents of the /foo directory, strips all the non-alphanumeric characters, reformats the string to show only $FOO and $BAR and then shows the duplicates case-insensitive.<br>

In my dir with 1500 items I got about 70 duplicates, most of them were really positives, only some few false-positives because of the stripped "some-shit" at the end.<br>

<br>

Hope this helps someone, but I also would love to see your comments how the search for duplicates could be improved.</p></body></html>