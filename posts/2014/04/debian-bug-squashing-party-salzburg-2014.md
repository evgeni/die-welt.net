<html><body><p><img class="image-reference" src="/wp-content/uploads/2014/04/bsp2014_small.png" alt="bsp2014_small" class="aligncenter size-medium wp-image-1295"></p>
<p>This weekend, <a href="http://bzed.de/">Bernd Zeimetz</a> organized a BSP at the offices of <a href="https://www.conova.com/">conova</a> in Salzburg, Austria.
Three days of discussions, bugfixes, <a href="https://lists.debian.org/debian-devel-announce/2014/04/msg00012.html">sparc removals</a> and a lot of fun and laughter.</p>
<p>We squashed a total of 87 bugs: 66 bugs affecting Jessie/Sid were closed, 9 downgraded and 8 closed via removals. As people tend to care about (old)stable, 3 bugs were fixed in Wheezy and one in Squeeze. These numbers might be not totaly correct, as were kinda creative at counting... <a href="http://www.marga.com.ar/">Marga</a> promised a talk about "an introduction to properly counting bugs using the 'Haus vom Nikolaus' algorithm to the base of 7".</p>
<p><a href="/wp-content/uploads/2014/04/IMG_20140427_182902.jpg"><img src="/wp-content/uploads/2014/04/IMG_20140427_182902-225x300.jpg" alt="IMG_20140427_182902" width="225" height="300" class="aligncenter size-medium wp-image-1294"></a></p>
<p>Speaking of numbers, I touched the following bugs (not all RC):</p>
<ul>
<li><a href="http://bugs.debian.org/741806">#741806</a>: <strong>pygresql</strong>: FTBFS: pgmodule.c:32:22: fatal error: postgres.h: No such file or directory<br>
Uploaded an NMU with a patch. The bug was introduced by the recent PostgreSQL development package reorganisation.</li>
<li><a href="http://bugs.debian.org/744229">#744229</a>: <strong>qpdfview</strong>: FTBFS synctex/synctex_parser.c:275:20: fatal error: zlib.h: No such file or directory<br>
Talked to the maintainer, explaining the importance of the upload and verifying his fix.</li>
<li><a href="http://bugs.debian.org/744300">#744300</a>: <strong>pexpect</strong>: missing dependency on dh-python<br>
Downgraded to wishlist after verifying the <em>build</em> dependency is only needed when building for Wheezy backports.</li>
<li><a href="http://bugs.debian.org/744917">#744917</a>: <strong>luajit</strong>: FTBFS when /sbin is not in $PATH<br>
Uploaded an NMU with a patch, which later was canceled due to a maintainer upload with a slightly different fix.</li>
<li><a href="http://bugs.debian.org/742943">#742943</a>: <strong>nagios-plugins-contrib</strong>: check_raid: wants mpt-statusd / mptctl<br>
Analyzed the situation, verified the status with the latest upstream version of the ckeck and commented on the bug.</li>
<li><a href="http://bugs.debian.org/732110">#732110</a>: <strong>nagios-plugins-contrib</strong>: check_rbl error when nameserver available only in IPv6<br>
Verify that the bug is fixed in the latest release and mark it as done.</li>
<li><a href="http://bugs.debian.org/684726">#684726</a>: <strong>nagios-plugins-contrib</strong>: RFP: check-v46 -- Icinga / Nagios plugin for dual stacked (IPv4 / IPv6) hosts<br>
Mark bug as done, the changelog was missing a proper "Closes" tag.</li>
<li><a href="http://bugs.debian.org/661167">#661167</a>: <strong>nagios-plugins-contrib</strong>: please include nagios-check-printer-status<br>
Mark bug as done, the changelog was missing a proper "Closes" tag.</li>
<li><a href="http://bugs.debian.org/745895">#745895</a>: <strong>nagios-plugins-contrib</strong>: does not compile against Varnish 4.0.0<br>
Write a patch for supporting the Varnish 3 and 4 APIs at the same time. Also <a href="https://github.com/varnish/varnish-nagios/pull/3">proposed the patch upstream</a>.</li>
<li><a href="http://bugs.debian.org/744922">#744922</a>: <strong>nagios-plugins-contrib</strong>: check_packages: check for security updates broken<br>
Forward our <code>security_updates_critical</code> patch and Felix' fixes to it upstream, then updating <code>check_packages</code> to the latest upstream version.</li>
<li><a href="http://bugs.debian.org/744248">#744248</a>: <strong>nagios-plugins-contrib</strong>: check_cert_expire: support configurable warn/crit times<br>
Forward Helmut's patch upstream, then updating <code>check_cert_expire</code> to the latest upstream version.</li>
<li><a href="http://bugs.debian.org/745691">#745691</a>: <strong>django-classy-tags</strong>: FTBFS: Sphinx documentation not found<br>
Analyze the issue and the fix proposed in SVN, comment on the bug.</li>
<li><a href="http://bugs.debian.org/713876">#713876</a>: <strong>thinkfan</strong>: [PATCH] bugfix: use $MAINPID for ExecReload<br>
Prepare and upload of the latest upstream release, which includes Michael's patch.</li>
<li><a href="http://bugs.debian.org/713878">#713878</a>: <strong>thinkfan</strong>: [PATCH] use dh-systemd for proper systemd-related maintscripts<br>
Apply Michael's patch to the Debian packaging.</li>
<li><a href="http://bugs.debian.org/728087">#728087</a>: <strong>thinkfan</strong>: Document how to start thinkfan with systemd<br>
Apply Michael's patch to the Debian packaging.</li>
<li><a href="http://bugs.debian.org/742515">#742515</a>: <strong>blktap-dkms</strong>: blktapblktap kernel module failed to build<br>
Upload an NMU with a patch based on the upstream fix.</li>
<li><a href="http://bugs.debian.org/745598">#745598</a>: <strong>libkolab</strong>: FTBFS in dh_python2 (missing Build-Conflicts?)<br>
Upload an NMU with a patch against libkolab's cmake rules, tightening the search for Python to 2.7.</li>
<li><a href="http://bugs.debian.org/745599">#745599</a>: <strong>libkolabxml</strong>: FTBFS with undefined reference to symbol '_ZTVN5boost6detail16thread_data_baseE'<br>
Upload an NMU with a patch against libkolabxml's cmake rules, properly linking the tests to the Boost libraries.</li>
<li><a href="http://bugs.debian.org/746160">#746160</a>: <strong>libcolabxml</strong>: FTBFS when both python2 and python3 development headers are installed<br>
Filling the bug while working on #745599, then uploading an NMU with a patch against libkolabxml's cmake rules, tightening the search for Python to 2.7.</li>
<li><a href="http://bugs.debian.org/714045">#714045</a>: <strong>blcr-dkms</strong>: blcr module is not built on kernel 3.9.1<br>
Checking the status of the bug upstream, and marking it as forwarded.</li>
<li><a href="http://bugs.debian.org/653404">#653404</a>: <strong>hdapsd</strong>: init.d status support<br>
Added Peter's patch to the Debian packaging, upload yet pending.  </li>
<li><a href="http://bugs.debian.org/702199">#702199</a>: <strong>hdapsd</strong>: Typo in package description<br>
Fixed typo in the description, upload yet pending.</li>
<li><a href="http://bugs.debian.org/745219">#745219</a>: <strong>crmsh</strong>: should depends on python-yaml<br>
Verifying the bug with Stefan Bauer and sponsoring his NMU.</li>
<li><a href="http://bugs.debian.org/741600">#741600</a>: <strong>389-ds-base</strong>: CVE-2014-0132<br>
Sponsoring the NMU for Tobias Frost.</li>
</ul>
<p>A couple of (non-free) pictures are available at <a href="http://www.salzburg-cityguide.at/de/news/detail/backflash/debian-bug-squashing-party-2014_203624">Uwe's salzburg-cityguide.at</a>.</p>
<p>Thanks again to <a href="http://bzed.de/">Bernd</a> for organizing and <a href="https://www.conova.com/">conova</a> and <a href="http://www.credativ.de">credativ</a> for sponsoring!</p>
</body></html>
