<!--
.. title: Using HPONCFG on CentOS Stream 9 with OpenSSL 3.2
.. slug: using-hponcfg-on-centos-stream-9-with-openssl-32
.. date: 2024-05-15 09:14:23 UTC
.. tags: english,linux,software,planet-debian,hardware,centos
.. category: 
.. link: 
.. description: 
.. type: text
-->

Today I've updated an HPE ProLiant DL325 G10 from CentOS Stream 8 to CentOS Stream 9 (details on that to follow) and realized that `hponcfg` was broken afterwards.

As I do not have a support contract with HPE, I couldn't just yell at them in private, so I am doing this in public now ;-)

```console
# hponcfg
HPE Lights-Out Online Configuration utility
Version 5.6.0 Date 11/30/2020 (c) 2005,2020 Hewlett Packard Enterprise Development LP
Error: Unable to locate SSL library.
       Install latest SSL library to use HPONCFG.
```

Welp, what the heck?

But wait, 5.6.0 from 2020 looks old, let's update this first!

`hponcfg` is part of the "Management Component Pack" (at least if you're not running RHEL or SLES where you get it via the "Service Pack for ProLiant" which requires a support contract)
and can be downloaded from the [Software Delivery Repository](https://downloads.linux.hpe.com/SDR/project/mcp/).

The Software Delivery Repository tells you to configure it in `/etc/yum.repos.d/mcp.repo` as

```ini
[mcp]
name=Management Component Pack
baseurl=http://downloads.linux.hpe.com/repo/mcp/dist/dist_ver/arch/project_ver
enabled=1
gpgcheck=0
gpgkey=file:///etc/pki/rpm-gpg/GPG-KEY-mcp
```

`gpgcheck=0`? Suuure!
Plain HTTP? Suuure!

But it gets better!
When you look at [https://downloads.linux.hpe.com/repo/mcp/centos/](https://downloads.linux.hpe.com/repo/mcp/centos/) (you have to substitute _dist_ with your distribution!) you'll see that there is no `9` folder and thus no packages for CentOS (Stream) 9.
There are however folders for Oracle, Rocky and Alma. Phew. Let's take one of these!

```ini
[mcp]
name=Management Component Pack
baseurl=https://downloads.linux.hpe.com/repo/mcp/rocky/9/x86_64/current/
enabled=1
gpgcheck=1
gpgkey=https://downloads.linux.hpe.com/repo/mcp/GPG-KEY-mcp
```

`dnf upgrade hponcfg` updates it to `hponcfg-6.0.0-0.x86_64` and:

```console
# hponcfg
HPE Lights-Out Online Configuration utility
Version 6.0.0 Date 10/30/2022 (c) 2005,2022 Hewlett Packard Enterprise Development LP
Error: Unable to locate SSL library.
       Install latest SSL library to use HPONCFG.
```

Fuck.

`ldd` doesn't show `hponcfg` being linked to `libssl`, do they `dlopen()` at runtime and fucked something up?
`ltrace` to the rescue!

```console
# ltrace hponcfg
…
popen("strings /bin/openssl | grep 'Ope"..., "r")            = 0x621700
fgets("OpenSSL 3.2.1 30 Jan 2024\n", 256, 0x621700)          = 0x7ffd870e2e10
strstr("OpenSSL 3.2.1 30 Jan 2024\n", "OpenSSL 3.0")         = nil
…
```

WAT?

They run `strings /bin/openssl |grep 'OpenSSL'` and compare the result with `"OpenSSL 3.0"`?!

Sure, [OpenSSL 3.2 in EL9 is rather fresh](https://kojihub.stream.centos.org/koji/buildinfo?buildID=60616) and didn't hit RHEL/Oracle/Alma/Rocky yet,
but surely there are better ways to check for a compatible version of OpenSSL than **THIS**?!

Anyway, I am not going to downgrade my OpenSSL.
Neither will I patch it to pretend to be 3.0.

But I can patch the `hponcfg` binary!

```console
# vim /sbin/hponcfg
<go to line 146>
<replace 3.0 with 3.2>
:x
```

Yes, I used `vim`.
Yes, it works.
No, I won't guarantee this won't kill a kitten somewhere.

```console
# ./hponcfg
HPE Lights-Out Online Configuration utility
Version 6.0.0 Date 10/30/2022 (c) 2005,2022 Hewlett Packard Enterprise Development LP
Firmware Revision = 2.44 Device type = iLO 5 Driver name = hpilo

USAGE:
  hponcfg  -?
  hponcfg  -h
  hponcfg  -m minFw
  hponcfg  -r [-m minFw] [-u username] [-p password]
  hponcfg  -b [-m minFw] [-u username] [-p password]
  hponcfg  [-a] -w filename [-m minFw] [-u username] [-p password]
  hponcfg  -g [-m minFw] [-u username] [-p password]
  hponcfg  -f filename [-l filename] [-s namevaluepair] [-v] [-m minFw] [-u username] [-p password]
  hponcfg  -i [-l filename] [-s namevaluepair] [-v] [-m minFw] [-u username] [-p password]

  -h,  --help           Display this message
  -?                    Display this message
  -r,  --reset          Reset the Management Processor to factory defaults
  -b,  --reboot         Reboot Management Processor without changing any setting
  -f,  --file           Get/Set Management Processor configuration from "filename"
  -i,  --input          Get/Set Management Processor configuration from the XML input
                        received through the standard input stream.
  -w,  --writeconfig    Write the Management Processor configuration to "filename"
  -a,  --all            Capture complete Management Processor configuration to the file.
                        This should be used along with '-w' option
  -l,  --log            Log replies to "filename"
  -v,  --xmlverbose     Display all the responses from Management Processor
  -s,  --substitute     Substitute variables present in input config file
                        with values specified in "namevaluepairs"
  -g,  --get_hostinfo   Get the Host information
  -m,  --minfwlevel     Minimum firmware level
  -u,  --username       iLO Username
  -p,  --password       iLO Password
```

For comparison, here is the `diff --text` output:

```diff
# diff -u --text /sbin/hponcfg ./hponcfg
--- /sbin/hponcfg	2022-08-02 01:07:55.000000000 +0000
+++ ./hponcfg	2024-05-15 09:06:54.373121233 +0000
@@ -143,7 +143,7 @@
 helpget_hostinforesetwriteconfigallfileinputlogminfwlevelxmlverbosesubstitutetimeoutdbgverbosityrebootusernamepasswordlibpath%Ah*Ag7Ar=AwIAaMAfRAiXAl\AmgAvrAs}At�Ad�Ab�Au�Ap�Azhgrbaw:f:il:m:vs:t:d:z:u:p:tmpXMLinputFile%2d.xmlw+Error: Syntax Error - Invalid options present.
 =O@aQ@aQ@aQ@aQ@aQ@aQ@aQ@aQ@aQ@aQ@aQ@aQ@aQ@aQ@aQ@aQ@aQ@aQ@aQ@aQ@aQ@aQ@aQ@aQ@aQ@aQ@aQ@aQ@aQ@aQ@aQ@aQ@aQ@�M@�M@aQ@�M@aQ@�N@�M@�N@�P@aQ@aQ@�M@�M@aQ@aQ@LN@aQ@�M@�O@�M@�M@�M@�M@aQ@aQ@�M@<!----><LOGINUSER_LOGINPASSWORD<LOGIN USER_LOGIN="%s" PASSWORD="%s"ERROR: LOGIN tag is missing.
 >ERROR: LOGIN end tag is missing.
-strings  | grep 'OpenSSL 1' | grep 'OpenSSL 3'OpenSSL 1.0OpenSSL 1.1OpenSSL 3.0which openssl 2>&1/usr/bin/opensslOpenSSL location - %s
+strings  | grep 'OpenSSL 1' | grep 'OpenSSL 3'OpenSSL 1.0OpenSSL 1.1OpenSSL 3.2which openssl 2>&1/usr/bin/opensslOpenSSL location - %s
 Current version %s

 No response from command.
```

Pretty sure it won't apply like this with `patch`, but you get the idea.

And yes, double-giggles for the fact that the error message says "Install latest SSL library to use HPONCFG" and the issues is *because* I have the latest SSL library installed…
