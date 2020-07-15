<!--
.. title: Scanning with a Brother MFC-L2720DW on Linux without any binary blobs
.. slug: scanning-with-a-brother-mfc-l2720dw-on-linux-without-any-binary-blobs
.. date: 2020-07-15 19:08:05 UTC
.. tags: english,linux,planet-debian,software
.. category: 
.. link: 
.. description: 
.. type: text
-->

Back in 2015, I've got a [Brother MFC-L2720DW](https://www.brother-usa.com/products/mfcl2720dw) for the casual "I need to print those two pages" and "I need to scan these receipts" at home (and home-office ;)). It's a rather cheap (I paid less than 200€ in 2015) monochrome laser printer, scanner and fax with a (well, two, wired and wireless) network interface. In those five years I've never used the fax or WiFi functions, but printed a scanned a few pages.

[Brother offers Linux drivers](https://support.brother.com/g/b/downloadtop.aspx?c=us&lang=en&prod=mfcl2720dw_us_eu_as), but those are binary blobs which I never really liked to run.

The printer part works just fine with a "Generic PCL 6/PCL XL" driver in CUPS or even "driverless" via AirPrint on Linux. You can also feed it plain PostScript, but I found it rather slow compared to PCL. On recent Androids it works using the built in printer service or [Mopria Printer Service](https://play.google.com/store/apps/details?id=org.mopria.printplugin) for older ones - I used to joke "why would you need a printer on your phone?!", but found it quite useful after a few tries.

However, for the scanner part I had to use Brother's `brscan4` driver on Linux and their [iPrint&Scan app](https://play.google.com/store/apps/details?id=com.brother.mfc.brprint) on Android - [Mopria Scan](https://play.google.com/store/apps/details?id=org.mopria.scan.application) wouldn't support it.

Until, last Friday, I've seen a [NEW](https://twitter.com/DebianNew/status/1281648320264327168) [package](https://ftp-master.debian.org//new/sane-airscan_0.99.8-1.html) being uploaded to Debian: [`sane-airscan`](https://github.com/alexpevzner/sane-airscan). And yes, monitoring the Debian NEW queue via Twitter is totally legit!

`sane-airscan` is an implementation of Apple's AirScan (eSCL) and Microsoft's WSD/WS-Scan protocols for SANE. I've never heard of those before - only about AirPrint, but thankfully this does not mean nobody has reverse-engineered them and created something that works beautifully on Linux. As of today there are no packages in the official Fedora repositories and the Debian ones are still in NEW, however the upstream documentation refers to an [openSUSE OBS repository](https://software.opensuse.org//download.html?project=home%3Apzz&package=sane-airscan) that works like a charm in the meantime (on Fedora 32).

The only drawback I've seen so far: the scanner only works in "Color" mode and there is no way to scan in "Grayscale", making scanning a tad slower. This [has been reported upstream](https://github.com/alexpevzner/sane-airscan/issues/49#issuecomment-656714897) and might or might not be fixable, as it seems the device does not announce any mode besides "Color".

Interestingly, [SANE has an eSCL backend on its own since 1.0.29](https://gitlab.com/sane-project/backends/-/commit/7c34046a396045c8e042d80674c6ef1ea880d97d), but it's [disabled in Fedora in favor of `sane-airscan`](919b6c52ecd394850cbd300e4fc38f2a2aa64b25) even though the later isn't available in Fedora yet. However, it might not even need separate packaging, as [SANE upstream is planning to integrate it into `sane-backends` directly](https://gitlab.com/sane-project/backends/-/issues/202).
