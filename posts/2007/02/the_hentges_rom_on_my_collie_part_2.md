<html><body><p>So finally I got it working! The Hentges ROM on my Zaurus SL-5500G is up and running. It was a little bit crazy because it always hung during ipkg &lt;somewhat&gt;, so I show you how it works ;)<br>

<br>

For the whole procedure you need one SD card and your Zaurus.<br>

<br>

1. Get the <a href="http://oz.hentges.net/releases/3.5.4.1/T1/collie/ext2/hentges-gpe-image-collie_T1-3.5.4.1-rc4-collie.rootfs.ext2.gz" target="_blank">Hentges GPE rootfs image</a> (you also can choose Opie, that does not change anything). You can get the cardfs images too, then you will have more apps after installing.<br>

2. Clear your SD card and create one ext2 partition on it (yes, ext2, ext3 didn't work for me).<br>

3. Extract the rootfs.gz to the boot-images directory on your SD card (it should be about 150MB :/) and rename it to $FOO-rootfs.bin where $FOO is some foo ;-)<br>

4. Put the SD card into your Zaurus and boot from it (altboot option #3).<br>

5. While booting you'll be asked if you want to have your ipkg-lists in RAM. Say no!<br>

6. Setup networking and ssh into your Zaurus.<br>

7. If you have booted the GUI, stop it: /etc/init.d/gpe-dm stop.<br>

8. As Hentges has changed his feeds since the last image-release, you need to update the ipkg.conf. Mine looks like this:<br>

<br>

src upgrades http://ewi546.ewi.utwente.nl/mirror/ www.openzaurus.org/official/unstable/3.5.4.1/feed/upgrades<br>

src machine-upgrades http://ewi546.ewi.utwente.nl/mirror/ www.openzaurus.org/official/unstable/3.5.4.1/feed/upgrades/machine/collie<br>

src machine http://ewi546.ewi.utwente.nl/mirror/ www.openzaurus.org/official/unstable/3.5.4.1/feed/machine/collie<br>

src base http://ewi546.ewi.utwente.nl/mirror/ www.openzaurus.org/official/unstable/3.5.4.1/feed/base<br>

src x11 http://ewi546.ewi.utwente.nl/mirror/ www.openzaurus.org/official/unstable/3.5.4.1/feed/x11<br>

src hentges-upgrades http://oz.hentges.net/hentges-feeds/1.0.x/stable/common-upgrades/<br>

src hentges-collie http://oz.hentges.net/hentges-feeds/1.0.x/stable/machine-upgrades/collie/<br>

<br>

dest root /<br>

dest cf /media/cf/<br>

dest sd /media/card/<br>

dest ram /media/ram/<br>

<br>

#Move ipkg list data into RAM<br>

# lists_dir ext /var/ipkg/lists<br>

<br>

9. Your ipkg.conf will be overwritten by ipkg-collateral during the upgrade process (someone has forgotten to set the configfile flag), so backup it NOW!<br>

10. Now you only have to do<br>

# ipkg update<br>

# ipkg upgrade<br>

# ipkg-link mount /media/card<br>

and your Zaurus is uptodate.<br>

<br>

Have fun with Hentges/OpenZaurus and your Collie!</p></body></html>