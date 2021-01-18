<!--
.. title: building a simple KVM switch for 30€
.. slug: building-a-simple-kvm-switch-for-30eur
.. date: 2021-01-18 13:25:34 UTC
.. tags: english,linux,software,hardware,planet-debian
.. category: 
.. link: 
.. description: 
.. type: text
-->

Prompted by tweets from [Lesley](http://twitter.com/hacks4pancakes) and [Dave](http://twitter.com/dave_universetf), I thought about [KVM switches](https://en.wikipedia.org/wiki/KVM_switch) again and came up with a rather cheap solution to my individual situation (YMMY, as usual).

As I've [written last year](/2020/06/show-your-desk/), my desk has one monitor, keyboard and mouse and two computers. Since writing that post I got a new (bigger) monitor, but also an USB switch again (a [DIGITUS USB 3.0 Sharing Switch](https://www.digitus.info/en/products/computer-and-office-accessories/computer-accessories/usb-components-and-accessories/switches/da-73300-1/)) - this time one that doesn't freak out my dock \o/

However, having to switch the used computer in two places (USB and monitor) is rather inconvenient, but also getting an KVM switch that can do 4K@60Hz was out of question.

Luckily, hackers gonna hack, everything, and not only receipt printers (😉). There is a tool called [`ddcutil`](https://www.ddcutil.com/) that can talk to your monitor and change various settings. And `udev` can execute commands when (USB) devices connect… You see where this is going?

After installing the package (available both in Debian and Fedora), we can inspect our system with `ddcutil detect`. You might have to load the `i2c_dev` module (thanks Philip!) before this works -- it seems to be loaded automatically on my Fedora, but you never know 😅.

```console
$ sudo ddcutil detect
Invalid display
   I2C bus:             /dev/i2c-4
   EDID synopsis:
      Mfg id:           BOE
      Model:
      Serial number:
      Manufacture year: 2017
      EDID version:     1.4
   DDC communication failed
   This is an eDP laptop display. Laptop displays do not support DDC/CI.

Invalid display
   I2C bus:             /dev/i2c-5
   EDID synopsis:
      Mfg id:           AOC
      Model:            U2790B
      Serial number:
      Manufacture year: 2020
      EDID version:     1.4
   DDC communication failed

Display 1
   I2C bus:             /dev/i2c-7
   EDID synopsis:
      Mfg id:           AOC
      Model:            U2790B
      Serial number:
      Manufacture year: 2020
      EDID version:     1.4
   VCP version:         2.2
```

The first detected display is the built-in one in my laptop, and those don't support DDC anyways. The second one is a ghost (see [ddcutil#160](https://github.com/rockowitz/ddcutil/issues/160)) which we can ignore. But the third one is the one we can (and will control). As this is the only *valid* display `ddcutil` found, we don't need to specify which display to talk to in the following commands. Otherwise we'd have to add something like `--display 1` to them.

A `ddcutil capabilities` will show us what the monitor is capable of (or what it thinks, I've heard some give rather buggy output here) -- we're mostly interested in the "Input Source" feature (Virtual Control Panel (VCP) code `0x60`):

```console
$ sudo ddcutil capabilities
…
   Feature: 60 (Input Source)
      Values:
         0f: DisplayPort-1
         11: HDMI-1
         12: HDMI-2
…
```

Seems mine supports it, and I should be able to switch the inputs by jumping between `0x0f`, `0x11` and `0x12`. You can see other values defined by the spec in `ddcutil vcpinfo 60 --verbose`, some monitors are using wrong values for their inputs 🙄. Let's see if `ddcutil getvcp` agrees that I'm using DisplayPort now:

```console
$ sudo ddcutil getvcp 0x60
VCP code 0x60 (Input Source                  ): DisplayPort-1 (sl=0x0f)
```

And try switching to HDMI-1 using `ddcutil setvcp`:

```console
$ sudo ddcutil setvcp 0x60 0x11
```

Cool, cool. So now we just need a way to trigger input source switching based on some event…

There are three devices connected to my USB switch: my keyboard, my mouse and my Yubikey. I do use the mouse and the Yubikey while the laptop is not docked too, so these are not good indicators that the switch has been turned to the laptop. But the keyboard is!

Let's see what vendor and product IDs it has, so we can write an `udev` rule for it:

```console
$ lsusb
…
Bus 005 Device 006: ID 17ef:6047 Lenovo ThinkPad Compact Keyboard with TrackPoint
…
```

Okay, so let's call `ddcutil setvcp 0x60 0x0f` when the USB device `0x17ef:0x6047` is added to the system:

```text
ACTION=="add", SUBSYSTEM=="usb", ATTR{idVendor}=="17ef", ATTR{idProduct}=="6047", RUN+="/usr/bin/ddcutil setvcp 0x60 0x0f"
```

```console
$ sudo vim /etc/udev/rules.d/99-ddcutil.rules
$ sudo udevadm control --reload
```

And done! Whenever I connect my keyboard now, it will force my screen to use DisplayPort-1.

On my workstation, I deployed the same rule, but with `ddcutil setvcp 0x60 0x11` to switch to HDMI-1 and my cheap not-really-KVM-but-in-the-end-KVM-USB-switch is done, for the price of one USB switch (~30€).

Note: if you want to use `ddcutil` with a Lenovo Thunderbolt 3 Dock (or any other dock using Displayport Multi-Stream Transport (MST)), you'll need [kernel 5.10](https://github.com/torvalds/linux/commit/adb48b26985686f93f20ca71c16c067d790e7af3) or newer, which fixes a [bug](https://gitlab.freedesktop.org/drm/intel/-/issues/37) that prevents [`ddcutil` from talking to the monitor using I²C](https://github.com/rockowitz/ddcutil/issues/11).
