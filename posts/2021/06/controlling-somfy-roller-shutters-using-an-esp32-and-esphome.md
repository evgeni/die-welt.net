<!--
.. title: Controlling Somfy roller shutters using an ESP32 and ESPHome
.. slug: controlling-somfy-roller-shutters-using-an-esp32-and-esphome
.. date: 2021-06-06 09:22:27 UTC
.. tags: english,planet-debian,hardware,home-automation
.. category: 
.. link: 
.. description: 
.. type: text
-->

Our house has solar powered, remote controllable roller shutters on the roof windows, built by the German company named HEIM & HAUS. However, when you look closely at the remote control or the shutter motor, you'll see another brand name: SIMU. As the shutters don't have any wiring inside the house, the only way to control them is via the remote interface. So let's go on the Internet and see how one can do that, shall we? ;)

First thing we learn is that SIMU remote stuff is just re-branded Somfy. Great, another name! Looking further we find that Somfy uses [some obscure protocol to prevent (replay) attacks](https://pushstack.wordpress.com/somfy-rts-protocol/) (spoiler: it doesn't!) and there are tools for [RTL-SDR](https://pushstack.wordpress.com/2014/05/17/somfy-rtl-sdr/) and [Arduino](https://github.com/Nickduino/Somfy_Remote) available. That's perfect!

## Always sniff with RTL-SDR first!

Given the two re-brandings in the supply chain, I wasn't 100% sure our shutters really use the same protocol. So the first "hack" was to listen and decrypt the communication using RTL-SDR:

```console
$ git clone https://github.com/dimhoff/radio_stuff
$ cd radio_stuff
$ make -C converters am_to_ook
$ make -C decoders decode_somfy
$ rtl_fm -M am -f 433.42M -s 270K | ./converters/am_to_ook -d 10 -t 2000 -  | ./decoders/decode_somfy
<press some buttons on the remote>
```

The output contains the buttons I pressed, but also the id of the remote and the command counter (which is supposed to prevent replay attacks). At this point I could just use the id and the counter to send own commands, but if I'd do that too often, the real remote would stop working, as its counter won't increase and the receiver will drop the commands when the counters differ too much.

But that's good enough for now. I know I'm looking for the right protocol at the right frequency. As the end result should be an ESP32, let's move on!

## Acquiring the right hardware

Contrary to an RTL-SDR, one usually does not have a spare ESP32 with 433MHz radio at home, so I went shopping: a NodeMCU-32S clone and a CC1101. The CC1101 is important as most 433MHz chips for Arduino/ESP only work at 433.92MHz, but Somfy uses 433.42MHz and using the wrong frequency would result in really bad reception. The CC1101 is essentially an SDR, as you can tune it to a huge spectrum of frequencies.

Oh and we need some cables, a bread board, the usual stuff ;)

The wiring is rather simple:

[![ESP32 wiring for a CC1101](https://raw.githubusercontent.com/LSatan/SmartRC-CC1101-Driver-Lib/50512abf62a4b86c457426f142ae05d1faff5aa3/img/Esp32_CC1101.png)](https://raw.githubusercontent.com/LSatan/SmartRC-CC1101-Driver-Lib/50512abf62a4b86c457426f142ae05d1faff5aa3/img/Esp32_CC1101.png)

And the end result isn't too beautiful either, but it works:

[![ESP32 and CC1101 in a simple case](/upload/esp32_cc1101.jpg)](/upload/esp32_cc1101.jpg)

## Acquiring the right software

In my initial research I found an Arduino sketch and was totally prepared to port it to ESP32, but luckily [somebody already did that for me](https://github.com/Legion2/Somfy_Remote_Lib)! Even better, it's explicitly using the CC1101. Okay, okay, I cheated, I actually ordered the hardware *after* I found [this](https://github.com/EinfachArne/Somfy_Remote) port and the reference to CC1101. ;)

As I am using [ESPHome](https://esphome.io) for my ESPs, the idea was to add a "Cover" that's controlling the shutters to it. Writing some C++, how hard can it be?

Turns out, not *that* hard. You can see the code in my [GitHub repo](https://github.com/evgeni/esphome-configs/). It consists of two (relevant) files: [`somfy_cover.h`](https://github.com/evgeni/esphome-configs/blob/devel/somfy_cover.h) and [`somfy.yaml`](https://github.com/evgeni/esphome-configs/blob/devel/somfy.yaml).

`somfy_cover.h` essentially wraps the communication with the `Somfy_Remote_Lib` library into an almost boilerplate [Custom Cover for ESPHome](https://esphome.io/components/cover/custom.html). There is nothing too fancy in there. The only real difference to the "Custom Cover" example from the documentation is the split into `SomfyESPRemote` (which inherits from `Component`) and `SomfyESPCover` (which inherits from `Cover`) -- this is taken from the [Custom Sensor documentation](https://esphome.io/components/sensor/custom.html#bonus-sensors-with-multiple-output-values) and allows me to define one "remote" that controls multiple "covers" using the `add_cover` function. The first two params of the function are the NVS name and key (think database table and row), and the third is the rolling code of the remote (stored in `somfy_secrets.h`, which is not in Git).

In ESPHome a `Cover` shall define its properties as `CoverTraits`. Here we call `set_is_assumed_state(true)`, as we don't know the state of the shutters - they could have been controlled using the other (real) remote - and setting this to `true` allows issuing open/close commands at all times. We also call `set_supports_position(false)` as we can't tell the shutters to move to a specific position.

The one additional feature compared to a normal `Cover` interface is the `program` function, which allows to call the "program" command so that the shutters can learn a new remote.

`somfy.yaml` is the ESPHome "configuration", which contains information about the used hardware, WiFi credentials etc. Again, mostly boilerplate. The interesting parts are the loading of the additional libraries and attaching the custom component with multiple covers and the additional `PROG` switches:

```yaml
esphome:
  name: somfy
  platform: ESP32
  board: nodemcu-32s
  libraries:
    - SmartRC-CC1101-Driver-Lib@2.5.6
    - Somfy_Remote_Lib@0.4.0
    - EEPROM
  includes:
    - somfy_secrets.h
    - somfy_cover.h
…

cover:
  - platform: custom
    lambda: |-
      auto somfy_remote = new SomfyESPRemote();
      somfy_remote->add_cover("somfy", "badezimmer", SOMFY_REMOTE_BADEZIMMER);
      somfy_remote->add_cover("somfy", "kinderzimmer", SOMFY_REMOTE_KINDERZIMMER);
      App.register_component(somfy_remote);
      return somfy_remote->covers;

    covers:
      - id: "somfy"
        name: "Somfy Cover"
      - id: "somfy2"
        name: "Somfy Cover2"

switch:
  - platform: template
    name: "PROG"
    turn_on_action:
      - lambda: |-
          ((SomfyESPCover*)id(somfy))->program();
  - platform: template
    name: "PROG2"
    turn_on_action:
      - lambda: |-
          ((SomfyESPCover*)id(somfy2))->program();
```

The switch to trigger the program mode took me a bit. As the Cover interface of ESPHome does not offer any additional functions besides movement control, I first wrote code to trigger "program" when "stop" was pressed three times in a row, but that felt really cumbersome and also had the side effect that the remote would send more than needed, sometimes confusing the shutters. I then decided to have a separate button (well, switch) for that, but the compiler yelled at me I can't call `program` on a `Cover` as it does not have such a function. Turns out, you need to explicitly cast to `SomfyESPCover` and then it works, even if the code becomes really readable, NOT. Oh and as the switch does not have any code to actually change/report state, it effectively acts as a button that can be pressed.

At this point we can just take an existing remote, press PROG for 5 seconds, see the blinds move shortly up and down a bit and press PROG on our new ESP32 remote and the shutters will learn the new remote.

And thanks to the awesome integration of ESPHome into HomeAssistant, this instantly shows up as a new controllable cover there too.

## ~~Future~~ Additional Work

I started writing this post about a year ago… And the initial implementation had some room for improvement…

### More than one remote

The [initial](https://github.com/evgeni/esphome-configs/blob/6ab67057d8bdd609e55c4f7ae593234f416c6119/somfy_cover.h) code only created one remote and one cover element. Sure, we could attach that to all shutters (there are 4 of them), but we really want to be able to control them separately.

Thankfully I managed to read enough ESPHome docs, and learned how to operate `std::vector` to make the code dynamically accept new shutters.

### Using ESP32's NVS

The ESP32 has a [non-volatile key-value storage](https://docs.espressif.com/projects/esp-idf/en/latest/esp32/api-reference/storage/nvs_flash.html) which is much nicer than throwing bits at an emulated EEPROM. The first library I used for that explicitly used EEPROM storage and it would have required quite some hacking to make it work with NVS. Thankfully the library I am using now has a plugable storage interface, and [I could just write the NVS backend myself](https://github.com/Legion2/Somfy_Remote_Lib/pull/8) and upstream now supports that. Yay open-source!

## Remaining issues

### Real state is unknown

As noted above, the ESP does not know the real state of the shutters: a command could have been lost in transmission (the Somfy protocol is send-only, there is no feedback) or the shutters might have been controlled by another remote. At least the second part *could* be solved by listening all the time and trying to decode commands heard over the air, but I don't think this is worth the time -- worst that can happen is that a closed (opened) shutter receives another close (open) command and that is harmless as they have integrated endstops and know that they should not move further.

### Can't program new remotes with ESP only

To program new remotes, one has to press the "PROG" button for 5 seconds. This was not exposed in the old library, but the new one does support "long press", I just would need to add another ugly `switch` to the config and I currently don't plan to do so, as I do have working remotes for the case I need to learn a new one.

