<html><body><p>So I got my hands on that new machine, somewhere, somehow, and I had to make myself comfortable on it. The biggest difference in that machine and the ones I used before is the RAID controller, an ﻿Adaptec 5405, instead of the 3ware ones I used to have before. That means getting used to new tools, messages and all these things which I'll try to document here.

</p><h1>Step 1: does vendor deliver?</h1>

Well, yes, mostly. There is (mainline) kernel support for the controller, Squeeze's kernel will boot up just fine and I just throw my junk into /dev/sda and it will handle the whole raidy thingy itself. But what is when I want to check the health of the disks, to add a spare or modify the caching? <a href="http://ask.adaptec.com/scripts/adaptec_tic.cfg/php.exe/enduser/std_adp.php?p_faqid=17008">Ask the mighty vendor and it will answer "Yes, you can!"</a>.



So I downloaded that ﻿asm_debian_x86_x64_v6_50_18570.tgz, unpacked and faced two debs, one i368 and one amd64. Yes, you could have saved half of the bandwidth if someone would have asked for the arch before, but who cares for some additional 60MiB today? So let's see what it does. Oh no, wait, there is a <del>README﻿</del>ASM_IUG_for_Debian_and_Ubuntu.txt:

<pre>1. Make sure to be in root level access.

2. Install the ASM storman .deb package. For example, if the package is storman_6.50-18570_i386.deb,

   then install it using the following command dpkg -i storman_6.50-18570_i386.deb

3. Adaptec Storage Manager will get installed at /usr/StorMan

4. Add the line /usr/StorMan to /etc/ld.so.conf. Then run "ldconfig". This is needed for the arcconf

   utility to find the path of the libstdc++.so.5 library</pre>

Well, 1 is obvious, so is 2.

For 3: hum, /usr/StorMan? Ever heard of FHS? Don't think so.

For 4: WTF?! I prefer to get libstdc++5 from my local Debian mirror instead.



But at least they provide a .deb, right? Uhm, no, it's an RPM converted via alien :( And don't dare to look at preinst, postinst and postrm (it extracts an own copy of Sun JRE 1.6u16, chmods around wildly on install and does rm -rf something on uninstall, <a href="https://github.com/MrMEEE/bumblebee/commit/a047be85247755cdbe0acce6f1dafc8beb84f2ac">did I see that some days ago on the webs</a>?). Let's get rid of that package as soon as possible, I decided, and just keep arcconf (which will be described later), esp because StorMan itself seems to include some call-home functionality which I'd like not to have:

<pre>cp -a /usr/StorMan/arcconf /usr/local/sbin/

apt-get remove --purge storman</pre>

<h1>Step 2: does community deliver?</h1>

You can, by the way, get (better) packages at <a href="http://hwraid.le-vert.net/wiki/DebianPackages">http://hwraid.le-vert.net/wiki/DebianPackages</a> from ﻿Adam Cécile (Le_Vert). I didn't test those much, but I currently use the arcconf package from there, which seems to be exactly what I need: proper dependencies and just the arcconf binary, no Java sh*t.

<h1>Step 3: monitor the controller</h1>

As this post is about monitoring, not ranting, let's continue. As mentioned before, I only have arcconf installed, which is just a cli to do stuff with the controller. If I understood the docs right, the actual StorMan is able to send notification mails when a disk dies or the controller gets eaten by aliens, but as I don't have StorMan, I have to do things myself.



Adam has a aacraid-status package in his repository, which includes some minimalistic shell-daemon to monitor the output of arcconf. It didn't perfectly fit my needs (and had some hickups with my disks which refuse to report a vendor, whyever), so I decided to write something myself (slightly based on what Adam has done in aacraid-status, though).



The result is on GitHub: <a href="https://github.com/evgeni/aacraid">https://github.com/evgeni/aacraid</a>



As you can see the code contains (at the time of writing) exactly ZERO comments and there is no README either, but it's actually quite usable already.

<ul>

<li>aacraid.py is the main magic inspired by Adam's aacraid-status, basically just parsing arcconf output</li>

<li>aacraid-status prints all useful info about all controllers, arrays and disks (the output is pretty much like Adam's)</li>

<li>aacraidd is a small daemon which will monitor all controllers every (per default) 5 minutes and mail you in case of status-change</li>

</ul>

I am now running aacraidd and get happy mails when something breaks :) [running = running from /etc/rc.local, no init script yet :)]

<h1>Step 4: monitor the disks via smartmontools</h1>

There is one little problem I have with arcconf: it's closed source and does magic to the controller.



With the old 3ware controller I was able to monitor the disks with smartmontools/smartd using something like this:

<pre>/dev/twa0 -d 3ware,0 -a -s L/../../2/01 -m root

/dev/twa0 -d 3ware,1 -a -s L/../../2/03</pre>

This is possible with Adaptect controllers too (not through /dev/twaX obviously). You have to have the <code>sg</code> module loaded, which will result in <code>/dev/sg[012]</code> on my machine, with <code>sg0</code> being the controller itself and <code>sg1/sg2</code> the both disks attached to it. Having sg loaded, one can now use smartd with:

<pre>/dev/sg1 -d sat -a -s L/../../7/01 -m root

/dev/sg2 -d sat -a -s L/../../7/02 -m root</pre>

(<code>-d sat</code> is the important option here!)



Thanks to <a href="http://www.thomas-krenn.com/de/wiki/Smartmontools_mit_Adaptec_RAID_Controller">Thomas Krenn Wiki: Smartmontools mit Adaptec RAID Controller</a> for the basic info and <a href="https://ostlogd.spenneberg.net/wordpress/?p=664">ostlogd.spenneberg.net: Adaptec-Raid-Controller S.M.A.R.T.-Healthstatus monitoren</a> for the pointer to the <code>sg</code> module!

<h1>Step 5: relax</h1>

Yupp, 4 steps are enough, go relax until the next disk dies (you will be doing something REALLY important that moment according to Murphy).</body></html>