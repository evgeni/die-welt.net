<!--
.. title: Building a Shelly 2.5 USB to TTL adapter cable
.. slug: building-a-shelly-25-usb-to-ttl-adapter-cable
.. date: 2020-05-12 10:44:35 UTC
.. tags: english,planet-debian,hardware
.. category: 
.. link: 
.. description: 
.. type: text
-->

When you want to flash your Shelly 2.5 with anything but the original firmware for the first time, you'll need to attach it to your computer. Later flashes can happen over the air (at least with ESPHome or Tasmota), but the first one cannot.

In theory, this is not a problem as the Shelly has a quite exposed and well documented interface:

![Shelly 2.5 pinout](https://shelly.cloud/wp-content/uploads/2019/01/pin_out-650x397.png)

However, on closer inspection you'll notice that your normal jumper wires don't fit as the Shelly has a connector with 1.27mm (0.05in) pitch and 1mm diameter holes.

Now, there are various tutorials on the Internet how to build a compatible connector using [Ethernet cables and hot glue or with female header socket legs](https://tasmota.github.io/docs/devices/Shelly-2.5/), and you can even buy [cables on Amazon for 18€](https://www.amazon.de/dp/B07TS2KPW7/)! But 18€ sounded like a lot and the female header socket thing while working was pretty finicky to use, so I decided to build something different.

We'll need 6 female-to-female jumper wires and a 1.27mm pitch male header. Jumper wires I had at home, the header I got is a [SL 1X20G 1,27 from reichelt.de](https://www.reichelt.de/20pol-stiftleiste-gerade-rm-1-27-sl-1x20g-1-27-p51694.html) for 0.61€. It's a 20 pin one, so we can make 3 adapters out of it if needed. Oh and we'll need some isolation tape.

![SL 1X20G 1,27](/upload/shelly/SL1X20G.jpg)

The first step is to cut the header into 6 pin chunks. Make sure not to cut too close to the 6th pin as the whole thing is rather fragile and you might lose it.

![SL 1X20G 1,27 cut into pieces](/upload/shelly/SL1X20G_cut.jpg)

It now fits very well into the Shelly with the longer side of the pins.

![Shelly 2.5 with pin headers attached](/upload/shelly/shelly_with_pins.jpg)

Second step is to strip the plastic part of one side of the jumper wires. Those are designed to fit 2.54mm pitch headers and won't work for our use case otherwise.

![jumper wire with removed plastic](/upload/shelly/jumper_wire_remove.jpg)

As the connectors are still too big, even after removing the plastic, the next step is to take some pliers and gently press the connectors until they fit the smaller pins of our header.

![Shelly 2.5 with pin headers and a jumper wire attached](/upload/shelly/shelly_with_pins_and_cable.jpg)

Now is the time to put everything together. To avoid short circuiting the pins/connectors, apply some isolation tape while assembling, but not too much as the space is really limited.

![Shelly 2.5 with pin headers and a jumper wire attached and taped](/upload/shelly/shelly_with_pins_and_cable_and_tape.jpg)

And we're done, a wonderful (lol) and working (yay) Shelly 2.5 cable that can be attached to any USB-TTL adapter, like the pictured FTDI clone you get almost everywhere.

![Shelly 2.5 with full cable and FTDI attached](/upload/shelly/shelly_with_ftdi.jpg)

Yes, in an ideal world we would have soldered the header to the cable, but I didn't feel like soldering on that limited space. And yes, shrink-wrap might be a good thing too, but again, limited space and with isolation tape you only need one layer between two pins, not two.
