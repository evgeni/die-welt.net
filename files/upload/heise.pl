#!/usr/bin/perl
#
# heise.pl by Evgeni Golov <sargentd@die-welt.net>
# inspired by heise.sh by Nico Golde <nico@ngolde.de>
# 
# fetches the news from heise.de and creates a rss-feed
#
# Licence: oh, well... 3-clause BSD would fit ;)
#
# Depends: perl, wget

my $browser = "Mozilla/4.0 (compatible ; MSIE 6.0; Windows NT 5.1)";
my $outfile = "/home/zhenech/heise/heise.rss";
my $tmppath = "/home/zhenech/heise";
my $htmlfile = $tmppath."/index.html";
my $articlefile = $tmppath."/article.html";

# fetch the main page
system("wget -O $htmlfile -U '$browser' http://www.heise.de/ > /dev/null 2>&1");

# prepare the rss file
open(my $rss, ">", $outfile) or die("Could not open $outfile");
print {$rss} '<?xml version="1.0" encoding="iso-8859-1" ?>

<rdf:RDF 
   xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
   xmlns:admin="http://webns.net/mvcb/"
   xmlns:content="http://purl.org/rss/1.0/modules/content/"
   xmlns:dc="http://purl.org/dc/elements/1.1/"
   xmlns:slash="http://purl.org/rss/1.0/modules/slash/"
   xmlns:wfw="http://wellformedweb.org/CommentAPI/"
   xmlns="http://my.netscape.com/rdf/simple/0.9/">
<channel>
<title>heise online News (full feed)</title>
<link>http://www.die-welt.net/upload/heise</link>
<description>Heise online</description>
<dc:language>de</dc:language>
</channel>
';

# read the main page and find the links to the articles
open(my $file, $htmlfile) or die("Could not open $htmlfile");
local $_;
while (<$file>) {
	if (/<h3 class=\"anriss\"> <a href=\"([a-z0-9\/]*?)\">(.*?)<\/a><\/h3>/i) {
		my $title = $2;
		$title =~ s,\&,\&amp\;,;
		my $link = "http://www.heise.de".$1;
		print {$rss} "<item>\n<title>$title</title>\n<link>$link</link>\n";
		print {$rss} "<description><![CDATA[";
		system("wget -O $articlefile -U '$browser' $link > /dev/null 2>&1");
		open(my $article, $articlefile) or die("Could not open $articlefile");
		local $_;
		my $do_print=1;
		my $heise=0;
		while (<$article>) {
			if (/(<HEISETEXT>)/) {
				$heise=1;
				next;
			}
			if (/(<\/HEISETEXT>)/) {
				$heise=0;
				next;
			}
			
			if ($heise==1 && /(<script|<noscript>|<table)/i) { 
				$do_print=0;
				#next;
			}
			if ($heise==1 && /(<\/script>|<\/noscript>|<\/table>)/i) { 
				$do_print=1;
				next;
			}
			
			if ($do_print==1 && $heise==1) {
				$_ =~ s,</[^a].*?>,,gi;
				$_ =~ s,<[^a/].*?>,,gi;
				$_ =~ s/^Anzeige\s*$//;
				$_ =~ s,=[ ]*"/,="http://www.heise.de/,; # fix links
				$_ =~ s,<a href="http://oas\.wwwheise\.de/.*?" target="_blank"></a>,,; # remove ad-links
				if (/^\s*$/) {
					#print($_);
				}
				else {
					print {$rss} $_;
				}
			}
		}
		print {$rss} "]]></description></item>\n";
		close($article);
		unlink($articlefile);
	}
}
close($file);
unlink($htmlfile);

print {$rss} '</rdf:RDF>';
close($rss);