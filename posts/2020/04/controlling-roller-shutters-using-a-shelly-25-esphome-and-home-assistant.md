<!--
.. title: Controlling roller shutters using a Shelly 2.5, ESPHome and Home Assistant
.. slug: controlling-roller-shutters-using-a-shelly-25-esphome-and-home-assistant
.. date: 2020-04-23 19:54:37 UTC
.. tags: english,linux,planet-debian,software,hardware
.. category: 
.. link: 
.. description: 
.. type: text
-->

Our house has roller shutters on all windows and most of them have an electric motor to open and close them. The motors are Schellenberg shaft motors (not sure this is the right English term), that you can configure end positions for and then by applying current to the right pair of pins they move the shutters up and down until the current is removed or one of the endstops is reached. As the motors were installed over a long period of time, the attached control units varied in functionality: different ways to program open/close times, with and without battery for the clock/settings etc, but they all had something in common: no central management and pretty ugly. We decided to replace those control units with regular 2 gang light switches that match the other switches in the house. And as we didn't want to lose the automatic open/close timer, we had to add some smarts to it.

## Shelly 2.5 and ESPHome

Say hello to [Shelly 2.5](https://shelly.cloud/shelly-25-wifi-smart-relay-roller-shutter-home-automation/)! The Shelly 2.5 is an ESP8266 with two relays attached to it in a super tiny package you can hide in the wall behind a regular switch. Pretty nifty. It originally comes with a [Mongoose OS](https://mongoose-os.com/) based firmware and an own app, but ain't nobody needs that, especially nobody who wants to implement some crude logic. That said, the original firmware isn't bad. It has a no-cloud mode, a REST API and does support MQTT for integration into Home Assistant and others.

My ESP firmware of choice is [ESPHome](https://esphome.io/), which you can flash easily onto a Shelly (no matter 1, 2 or 2.5) using a USB TTL adapter that provides 3.3V. Home Assistant has native ESPHome support with auto-discovery, which is much nicer than manually attaching things to MQTT topics.

To get ESPHome compiled for the Shelly 2.5, we'll need a basic configuration like this:

```yaml
esphome:
  name: shelly25
  platform: ESP8266
  board: modwifi
  arduino_version: 2.4.2
```

We're using `board: modwifi` as the Shelly 2.5 (and all other Shellys) has 2MB flash and the usually recommended `esp01_1m` would only use 1MB of that - otherwise the configurations are identical (see the PlatformIO entries for [modwifi](https://docs.platformio.org/en/latest/boards/espressif8266/modwifi.html) and [esp01_1m](https://docs.platformio.org/en/latest/boards/espressif8266/esp01_1m.html)). And `arduino_version: 2.4.2` is what the Internet suggests is the most stable SDK version, and who will argue with the Internet?!

Now an ESP8266 without network connection is boring, so we add a WiFi configuration:

```yaml
wifi:
  ssid: !secret wifi_ssid
  password: !secret wifi_password
  power_save_mode: none
```

The `!secret` commands load the named variables from [`secrets.yaml`](https://github.com/evgeni/esphome-configs/blob/master/secrets.yaml.example). While testing, I found the network connection of the Shelly very unreliable, especially when placed inside the wall and thus having rather bad bad reception (-75dBm according to ESPHome). However, setting `power_save_mode: none` explicitly seems to have fixed this, even if [`NONE` is supposed to be the default on ESP8266](https://esphome.io/components/wifi.html#wifi-power-save-mode).

At this point the Shelly has a working firmware and WiFi, but does not expose any of its features: no switches, no relays, no power meters.

To fix that we first need to find out the GPIO pins all these are connected to. Thankfully we can basically copy paste the definition from the [Tasmota](https://tasmota.github.io/docs/) (another open-source firmware for ESPs) [template](https://templates.blakadder.com/shelly_25.html):

```yaml
pin_led1: GPIO0
pin_button1: GPIO2
pin_relay1: GPIO4
pin_switch2n: GPIO5
pin_sda: GPIO12
pin_switch1n: GPIO13
pin_scl: GPIO14
pin_relay2: GPIO15
pin_ade7953: GPIO16
pin_temp: A0
```

If we place that into the `substitutions` section of the ESPHome config, we can use the names everywhere and don't have to remember the pin numbers.

The configuration for the [ADE7953 power sensor](https://esphome.io/components/sensor/ade7953.html) and the [NTC temperature sensor](https://esphome.io/components/sensor/ntc.html) are taken verbatim from the ESPHome documentation, so there is no need to repeat them here.

The configuration for the switches and relays are also rather straight forward:

```yaml
binary_sensor:
  - platform: gpio
    pin: ${pin_switch1n}
    name: "Switch #1"
    internal: true
    id: switch1

  - platform: gpio
    pin: ${pin_switch2n}
    name: "Switch #2"
    internal: true
    id: switch2

switch:
  - platform: gpio
    pin: ${pin_relay1}
    name: "Relay #1"
    internal: true
    id: relay1
    interlock: &interlock_group [relay1, relay2]

  - platform: gpio
    pin: ${pin_relay2}
    name: "Relay #2"
    internal: true
    id: relay2
    interlock: *interlock_group
```

All marked as `internal: true`, as we don't need them visible in Home Assistant.

## ESPHome and Schellenberg roller shutters

Now that we have a working Shelly 2.5 with ESPHome, how do we control Schellenberg (and other) roller shutters with it?

Well, first of all we need to connect the Up and Down wires of the shutter motor to the two relays of the Shelly. And if they would not be marked as `internal: true`, they would show up in Home Assistant and we would be able to flip them on and off, moving the shutters. But this would also mean that we need to flip them off each time after use, as while the motor knows when to stop and will do so, applying current to both wires at the same time produces rather *interesting* results. So instead of fiddling around with the relays directly, we define a [time-based cover](https://esphome.io/components/cover/time_based.html) in our configuration:

```yaml
cover:
  - platform: time_based
    name: "${location} Rolladen"
    id: rolladen

    open_action:
      - switch.turn_on: relay2
    open_duration: ${open_duration}

    close_action:
      - switch.turn_on: relay1
    close_duration: ${close_duration}

    stop_action:
      - switch.turn_off: relay1
      - switch.turn_off: relay2
```

We use a time-based cover because that's the easiest thing that will also turn the relays off for us after the shutters have been opened/closed, as the motor does not "report" any state back. We *could* use the integrated power meter of the Shelly to turn off when the load falls under a threshold, but I was too lazy and this works just fine as it is.

Next, let's add the physical switches to it. We could just add [`on_press` automations to the binary GPIO sensors](https://esphome.io/components/binary_sensor/index.html#binary-sensor-on-press) we configured for the two switch inputs the Shelly has. But if you have kids at home, you'll know that they like to press ALL THE THINGS and what could be better than a small kill-switch against small fingers?

```yaml
switch:
  [ previous definitions go here ]

  - platform: template
    id: block_control
    name: "${location} Block Control"
    optimistic: true

  - platform: template
    name: "Move UP"
    internal: true
    lambda: |-
      if (id(switch1).state && !id(block_control).state) {
        return true;
      } else {
        return false;
      }
    on_turn_on:
      then:
        cover.open: rolladen
    on_turn_off:
      then:
        cover.stop: rolladen

  - platform: template
    name: "Move DOWN"
    internal: true
    lambda: |-
      if (id(switch2).state && !id(block_control).state) {
        return true;
      } else {
        return false;
      }
    on_turn_on:
      then:
        cover.close: rolladen
    on_turn_off:
      then:
        cover.stop: rolladen
```

This adds three more [template switches](https://esphome.io/components/switch/template.html).
The first one, "Block Control", is exposed to Home Assistant, has no `lambda` definition and is set to `optimistic: true`, which makes is basically a dumb switch that can be flipped at will and the only thing it does is storing the binary on/off state.
The two others are almost identical. The name differs, obviously, and so does the `on_turn_on` automation (one triggers the cover to open, the other to close). And the really interesting part is the `lambda` that monitors one of the physical switches and if that is turned on, *plus* "Block Control" is off, reports the switch as turned on, thus triggering the automation.
With this we can now block the physical switches via Home Assistant, while still being able to control the shutters via the same.

All this (and a bit more) can be found in my [esphome-configs](https://github.com/evgeni/esphome-configs) repository on GitHub, enjoy!
