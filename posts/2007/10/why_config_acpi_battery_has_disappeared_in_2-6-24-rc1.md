<html><body><p>Today I have compiled 2.6.24-rc1 (from wireless-2.6 git) for testing the ath5k driver. Well, ath5k does not work as expected, but that's not the topic of this post.<br>
After Thomas 'tglx' Gleixner has said me, the his hrt patches are no longer needed with 2.6.24-rc1, I wanted to check that with powertop.<br>
During the check, powertop complained about CONFIG_ACPI_BATTERY not being set, and I was like "WTF o_O", because I used the .config of my 2.6.23 and just added the ath5k stuff to it.<br>
The option really wasn't set, and I also could not find the switch in menuconfig, where it always has been.<br>
After a small search and the help of ong from #powertop, I found the solution.<br>
CONFIG_ACPI_BATTERY now depends on POWER_SUPPLY (it's Device Drivers -&gt; Power supply class support), which was not enabled by default, and also was not enabled as a dependency of an enabled option...<br>
Well, after enabling POWER_SUPPLY, ACPI_BATTERY was back again.</p></body></html>