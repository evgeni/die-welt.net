<!--
.. title: Fixing the volume control in an Alesis M1Active 330 USB Speaker System
.. slug: fixing-the-volume-control-in-an-alesis-m1active-330-usb-speaker-system
.. date: 2024-09-14 18:38:18 UTC
.. tags: english,hardware,planet-debian
.. category: 
.. link: 
.. description: 
.. type: text
-->

I've a set of [Alesis M1Active 330 USB](https://www.alesis.com/products/view/m1active-330-usb.html) on my desk to listen to music.
They were relatively inexpensive (~100€), have USB and sound pretty good for their size/price.

They were also sitting on my desk unused for a while, because the left speaker didn't produce any sound.
Well, almost any.
If you'd move the volume knob long enough you might have found a position where the left speaker would work a bit,
but it'd be quieter than the right one and stop working again after some time.
Pretty unacceptable when you want to listen to music.

Given the right speaker was working just fine and the left would work a bit when the volume knob is moved,
I was quite certain which part was to blame: the potentiometer.

So just open the right speaker (it contains all the logic boards, power supply, etc),
take out the broken potentiometer, buy a new one, replace, done.
Sounds easy?

Well, to open the speaker you gotta loosen 8 (!) screws on the back.
At least it's not glued, right?
Once the screws are removed you can pull out the back plate, which will bring the power supply,
USB controller, sound amplifier and cables, lots of cables: two pairs of thick cables, one to each driver,
one thin pair for the power switch and two sets of "WTF is this, I am not going to trace pinouts today",
one with a 6 pin plug, one with a 5 pin one.

Unplug all of these!
Yes, they are plugged, nice.
Nope, still no friggin' idea how to get to the potentiometer.
If you trace the "thin pair" and "WTF1" cables, you see they go inside a small wooden box structure.
So we have to pull the thing from the front?

Okay, let's remove the plastic part of the knob
Right, this looks like a potentiometer.
Unscrew it.
No, no *need* for a Makita wrench, I just didn't have anything else in the right size (10mm).

![right Alesis M1Active 330 USB speaker with a Makita wrench where the volume knob is](/upload/alesis330m1_makita.jpg)

Still, no movement.
Let's look again from the inside!
Oh ffs, there are six more screws inside, holding the front.
Away with them!
Just need a very long PH1 screwdriver.

Now you can slowly remove the part of the front where the potentiometer is.
Be careful, the top tweeter is mounted to the front, not the main case and so is the headphone jack, without an obvious way to detach it.
But you can move away the front far enough to remove the small PCB with the potentiometer and the LED.

![right Alesis M1Active 330 USB speaker open](/upload/alesis330m1_open.jpg)

Great, this was the easy part!

The only thing printed on the potentiometer is "A10K".
10K is easy -- 10kOhm.
A?!
[Wikipedia says "A" means "logarithmic"](https://en.wikipedia.org/wiki/Potentiometer#Resistance%E2%80%93position_relationship:_%22taper%22), but only if made in the US or Asia.
In Europe that'd be "linear".
"B" in US/Asia means "linear", in Europe "logarithmic".
Do I need to tap the sign again?
(The sign is a print of [XKCD#927](https://xkcd.com/927/).)
My multimeter says in this case it's something like logarithmic.
On the right channel anyway, the left one is more like a chopping board.
And what's this green box at the end?
Oh right, this thing *also* turns the power on and off.
So it's a power switch.

Where the fuck do I get a logarithmic 10kOhm stereo potentiometer with a power switch?
And then in the exact right size too?!

Of course not at any of the big German electronics pharmacies.
[But AliExpress saves the day, again.](https://de.aliexpress.com/item/1005004283118519.html)
It's even the same color!

Soldering without pulling out the cable out of the case was a bit challenging,
but I've managed it and now have stereo sound again.
Yay!

PS: Don't operate this thing open to try it out. 230V are dangerous!
