<html><body><p>I will be moving soon and would like to replace my current NAS with something smaller, quieter and less power-hungry. Currently my NAS is <a title="Hardware" href="/hardware/">dorei</a> with an AMD Athlon II X2 240e and two 3.5" SATA2 disks. It's a nice machine, but I do not use its whole power and it's too bulky for the new place.

So, what do I really need?

</p><ul>

<li>Debian, obvioulsy</li>

<li>2 (or more) SATA ports</li>

<li>1 GigE port</li>

<li>preferably hardware crypto support (Intel AES-NI, VIA PadLock, etc)</li>

<li>enough power (CPU, RAM) to run the two disks in RAID-1 with dmcrypt and LVM (I do not need 200MiB/s, but 60-80 would be nice)</li>

<li>still enough power to run some mutt, irssi, mpd, icecast2 while idling</li>

</ul>

And what could I get?

<ul>

<li><strong>VIA LN10000EG</strong>, x86, 1GHz VIA C7, only 2xSATA<strong>1</strong>, only FastEthernet, "only" 1GiB RAM possible, fanless, has hardware crypto, pretty old, I could get one used from a friend almost free</li>

<li><strong>Qnap Turbo Station TS-219P II (or other TS-219...)</strong>, ARM, 2GHz Kirkwood, 2xSATA2 + 2xeSATA, 1GigE, 512MiB RAM, 3xUSB2.0, not fanless, seems to have hardware crypto, about 280€ at Amazon</li>

<li><strong>Synology DiskStation DS213 (or other DS21x)</strong>, ARM, 2GHz Kirkwood, 2xSATA2 + sometimes eSATA, USB3.0, not fanless, seems to have hardware crypto, about 270€ at Amazon</li>

<li><strong>ASUS NAS-M25</strong>, ARM, 1.2GHz Kirkwood, 2xSATA2, 3xUSB2.0, GigE, not fanless, no idea whether hackable enough to run Debian, about 150€ at Amazon</li>

<li><em>(update)</em> <strong>HP ProLiant MicroServer N40L</strong>, x86, 1.5GHz AMD Turion II Neo, USB2.0, GigE, not fanless, seems to run crypto at about 60MB/s, about 200€ at Amazon</li>

<li>(<em>update2</em>) <strong>excito B3</strong>, ARM, 1.2GHz Kirkwood, 1xSATA2, 1xeSATA, 2xGigE, fanless, would love to see some crypto information, about 300€ at Amazon</li>

<li>(<em>update3</em>) <strong>Zotac ZBOX nano VD01</strong>, x86, 1.2GHz VIA Nano X2, 1xSATA2, 1xeSATA, GigE, not fanless, VIA hw crypto, about 140€ at Amazon</li>

</ul>

What shouldn't I get?

<ul>

<li>something self-built would be expensive (about 200€ for CPU and board only, meh)</li>

<li>all those nice <a href="http://www.solid-run.com/products/cubox">CuBoxes</a>, <a href="http://cubieboard.org/">CubieBoards</a>, <a href="http://pandaboard.org/">PandaBoard</a>,<a href="http://trimslice.com/">Trim-Slice</a>and what else is out there seem to have either only one (e)SATA or only FastEthernet or even both</li>

<li>the (really nice) <a href="http://rhombus-tech.net/allwinner_a10/hacking_the_mele_a1000/">Mele A1000</a> has also only one SATA and only FastEthernet</li>

</ul>

So, dear Lazyweb, tell me where to spend my money, please! Are the Kirkwoods capable of doing LVM-on-DMCrypt-on-RAID1? Are there new Atoms that are capable of such a setup (my old Atom 330 stops at about 20MB/s)? Or should I stop worrying and switch to punch cards?</body></html>
