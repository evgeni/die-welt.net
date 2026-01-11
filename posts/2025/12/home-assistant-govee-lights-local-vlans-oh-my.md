<!--
.. title: Home Assistant, Govee Lights Local, VLANs, Oh my!
.. slug: home-assistant-govee-lights-local-vlans-oh-my
.. date: 2025-12-14 15:48:08 UTC
.. tags: english,linux,planet-debian,software,home-automation
.. category: 
.. link: 
.. description: 
.. type: text
-->

We recently bought some [Govee Glide Hexa Light Panels](https://eu.govee.com/products/govee-glide-hexa-light-panels), because they have a [local LAN API](https://app-h5.govee.com/user-manual/wlan-guide) that is [well integrated into Home Assistant](https://www.home-assistant.io/integrations/govee_light_local/).
Or so we thought.

Our network is not *that* complicated, but there is a dedicated VLAN for IOT devices.
Home Assistant runs in a container (with `network=host`) on a box in the basement, and that box has a NIC in the IOT VLAN so it can reach devices there easily.
So far, this has never been a problem.

Enter the Govee LAN API.
Or maybe its [Python implementation](https://pypi.org/project/govee-local-api/).
Not exactly sure who's to blame here.

The API involves sending JSON over multicast, which the Govee device will answer to.

> No devices found on the network

After turning logging for `homeassistant.components.govee_light_local` to 11, erm `debug`, we see:

```
DEBUG (MainThread) [homeassistant.components.govee_light_local.config_flow] Starting discovery with IP 192.168.42.2
DEBUG (MainThread) [homeassistant.components.govee_light_local.config_flow] No devices found with IP 192.168.42.2
```

That's not the IP address in the IOT VLAN!

Turns out the integration [recently got support for multiple NICs](https://github.com/home-assistant/core/pull/128123),
but Home Assistant doesn't just use all the interfaces it sees by default.

You need to go to *Settings* → *Network* → *Network adapter* and deselect "Autoconfigure",
which will allow your to select individual interfaces.

Once you've done that, you'll see `Starting discovery with IP` messages for all selected interfaces and adding of Govee Lights Local will work.
