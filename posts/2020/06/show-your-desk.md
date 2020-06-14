<!--
.. title: show your desk
.. slug: show-your-desk
.. date: 2020-06-10 14:30:07 UTC
.. tags: english,linux,planet-debian,software,hardware
.. category: 
.. link: 
.. description: 
.. type: text
-->

Some days ago I posted a picture of my desk on [Mastodon](https://chaos.social/@zhenech/104273419185014424) and [Twitter](https://twitter.com/zhenech/status/1267733105470832642).

[![standing desk with a monitor, laptop etc](/upload/IMG_20200602_094035.jpg)](/upload/IMG_20200602_094035.jpg)

After that I got multiple questions about the setup, so I thought "[Michael](https://dnsmichi.at/2020/04/28/first-time-all-remote-my-new-workspace-feat-standing-desk-and-curved-monitor/) and [Michael](https://michael.stapelberg.ch/posts/2020-05-23-desk-setup/) did posts about their setups, you could too!"

And well, here we are ;-)

# desk

The desk is a [Flexispot E5B](https://de.flexispot.com/hoehenverstellbarer-schreibtisch/e5-hohenverstellbares-tischgestell-3-fach-teleskop-nur-tischgestell.html) frame with a 200×80×2.6cm oak table top.

The Flexispot E5 (the B stands for black) is a rather cheap (as in not expensive) standing desk frame. It has a retail price of 379€, but you can often get it as low as 299€ on sale.

Add a nice table top from a local store (mine was like 99€), a bit of wood oil and work and you get a nice standing desk for less than 500€.

The frame has three memory positions, but I only use two: one for sitting, one for standing, and a "change position" timer that I never used so far.

The table top has a bit of a swing when in standing position (mine is at 104cm according to the electronics in the table), but not enough to disturb typing on the keyboard or thinking. I certainly wouldn't place a sewing machine up there, but that was not a requirement anyways ;)

To compare: the IKEA Bekant table has a similar, maybe even slightly stronger swing.

# chair

Speaking of IKEA… The chair is an IKEA Volmar. They don't seem to sell it since mid 2019 anymore though, so no link here.

# hardware

## laptop

A Lenovo ThinkPad T480s, i7-8650U, 24GB RAM, running Fedora 32 Workstation. Just enough power while not too big and heavy. Full of stickers, because I  ♥ stickers!

It's connected to a Lenovo ThinkPad Thunderbolt 3 Dock (Gen 1). After 2 years with that thing, I'm still not sure what to think about it, as I had various issues with it over the time:

- the internal USB hub just vanishing from existence until a full power cycle of the dock was performed, but that might have been caused by my USB-switch which I recently removed.
- the NIC negotiating at 100MBit/s instead of 1000MBit/s and then keeping on re-negotiating every few minutes, disconnecting me from the network, but I've not seen that since the Fedora 32 upgrade.
- the USB-attached keyboard not working during boot as it needs some [Thunderbolt magic](https://fedoramagazine.org/thunderbolt-how-to-use-keyboard-during-boot-time/).

The ThinkPad stands on a [Adam Hall Stands SLT001E](https://www.adamhall.com/shop/bd-en/stands-tripods/multimedia-equipment/5527/slt-001-e), a rather simple stand for laptops and other equipment (primarily made for DJs I think). The Dock fits exactly between the two feet of the stand, so that is nice and saves space on the table. Using the stand I can use the laptop screen as a second screen when I want it - but most often I do not and have the laptop lid closed while working.

## workstation

A Lenovo ThinkStation P410, Xeon E5-2620 v4, 96GB RAM, running Fedora 32 Workstation. That's my VM playground. Having lots of RAM really helps if you need/want to run many VMs with Foreman/Katello or Red Hat Satellite as they tend to be a bit memory hungry and throwing hardware at problems tend to be an easy solution for many of them.

The ThinkStation is also connected to the monitor, and I used to have an USB switch to flip my keyboard, mouse and Yubikey from the laptop to the workstation and back. But as noted above, this switch somehow made the USB hub in the laptop dock unhappy (maybe because I was switching too quickly after resume or so), so it's currently removed from the setup and I use the workstation via SSH only.

It's mounted under the table using a [ROLINE PC holder](https://www.secomp.de/de_DE/roline-pc-halter-ausziehbar-drehbar-schwarz/i/17031136). You won't get any design awards with it, but it's easy to assemble and allows the computer to move with the table, minimizing the number of cables that need to have a flexible length.

## monitor

The monitor is an older [Dell UltraSharp U2515H](https://www.dell.com/ee/business/p/dell-u2515h-monitor/pd) - a 25" 2560×1440 model. It sits on an Amazon Basics Monitor Arm (which is identical to an Ergotron LX to the best of my knowledge) and is accompanied by a Dell AC511 soundbar.

I don't use the adjustable arm much. It's from the time I had no real standing desk and would use the arm and a cardboard box to lift the monitor and keyboard to a standing level. If you don't want to invest in a standing desk, that's the best and cheapest solution!

The soundbar is sufficient for listening to music while working and for chatting with colleagues.

## webcam

A [Logitech C920 Pro](https://www.logitech.com/en-us/product/hd-pro-webcam-c920?crid=34), what else?

Works perfectly under Linux with the UVC driver and has rather good microphones. Actually, so good that I never use a headset during video calls and so far nobody complained about bad audio.

## keyboard

A [ThinkPad Compact USB Keyboard with TrackPoint](https://www.lenovo.com/gb/en/accessories-and-monitors/keyboards-and-mice/keyboards/KEYBOARD-UK-English/p/0B47221). The keyboard matches the one in my T480s, so my brain doesn't have to switch. It was awful when I still had the "old" model and had to switch between the two.

UK layout. Sue me. I like the big return key.

## mouse

A Logitech MX Master 2.

I got the MX Revolution as a gift a long time ago, and at first I was like: WTF, why would anyone pay hundred bucks for a mouse?! Well, after some time I knew, it's just that good. And when it was time to get a new one (the rubber coating gets all slippery after some time) the decision was rather easy.

I'm pondering if I should try the MX Ergo or the MX Vertical at some point, but not enough to go and buy one of them yet.

# other

## notepad

I'm terrible at remembering things, so I need to write them down. And I'm terrible at remembering to look at my notes, so they need to be in my view. So there is a regular A5 notepad on my desk, that gets filled with check boxes and stuff, page after page.

## coaster

It's a wooden table, you don't want to have liquids on it, right? Thankfully a friend of mine once made coasters out of old Xeon CPUs and epoxy. He gave me one in exchange for a busted X41 ThinkPad. I still think I made the better deal ;)

## yubikey

Keep your secrets safe! Mine is used as a GnuPG smart card for both encryption and SSH authentication, U2F on various pages and 2FA for VPN.

## headphones

I own a pair of Bose QuietComfort 25 with an aftermarket Bluetooth adapter and Anker SoundBuds Slim+. Both are used rather seldomly while working, as my office is usually quiet and no one is disturbed when I listen to music without headphones.

# what's missing?

## light

I want to add more light to the setup, noth to have a better picture during video calls but also to have better light when doing something else on the table - like soldering. The plan is to add an [IKEA Tertial](https://www.ikea.com/de/de/p/tertial-arbeitsleuchte-dunkelgrau-50355395/) with some Trådfri smart LED in it, but the Tertial is currently not available for delivery at IKEA and I'm not going to visit one in the current situation.

## bigger monitor

Currently pondering getting a bigger (27+ inch) 4K monitor. Still can't really decide which one to get. There are so many, and they all differ in some way. But it seems no affordable one is offering an integrated USB switch and sufficient amount of USB ports, so I'll probably get whatever can get me a good picture without any extra features at a reasonable price.

Changing the monitor will probably also mean rethinking the sound output, as I'm sure mounting the Dell soundbar to anything but the designated 5 year old monitor won't work too well.
