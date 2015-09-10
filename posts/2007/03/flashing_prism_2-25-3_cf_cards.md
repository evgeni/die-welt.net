<html><body><p>I recently bought a compact-flash WLAN card for my PDA - a BUFFALO WLI-CF-S11G which came with a fucking old firmware (1.3.4) so I could not get WPA working with wpa_supplicant.<br>
On the net I found several hints, I should update my firmware to 1.7.4 or something like it. I also found a nice <a href="http://linux.junsun.net/intersil-prism/" target="_blank">howto by jun sun</a> how actually to do the update and also where to <a href="http://linux.junsun.net/intersil-prism/firmware/1.7.4/" target="_blank">get the firmware-files</a>.<br>
ffs the hostap driver of my PDA was not compiled with CONFIG_HOSTAP_FIRMWARE=y and CONFIG_HOSTAP_FIRMWARE_NVRAM=y so I couldn't update the firmware directly on the PDA. So I got a cheap (8.50EUR incl shipping) CF to PCMCIA adaptor (Panasonic BN-CFADPP3) and tried my luck with my Debian laptop.<br>
<br>
Off course my kernel was without hostap support - why should it if I have only Intel and Atheros cards here? Recompiled, installed and got weird errors during modprobe:<br>
hostap: disagrees about version of symbol skb_queue_purge<br>
and so on - after a reboot it worked - don't ask me why, usually recompiling the modules and running depmod -a is sufficient.<br>
I also built hostap-utils 0.4.7 from source, because Debian still has 0.4.0 :(<br>
As root I ran<br>
./prism2_srec -v wlan0 pk010101.hex sf010704.hex<br>
./prism2_srec -v -f wlan0 pk010101.hex sf010704.hex<br>
from the dir with the hostap-utils and the downloaded firmware-files.<br>
<br>
Now I get<br>
# ./hostap_diag wlan0<br>
Host AP driver diagnostics information for 'wlan0'<br>
<br>
NICID: id=0x800c v1.0.0 (PRISM II (2.5) PCMCIA (SST parallel flash))<br>
PRIID: id=0x0015 v1.1.1<br>
STAID: id=0x001f v1.7.4 (station firmware)<br>
<br>
And WPA is working like a charm ;)</p></body></html>