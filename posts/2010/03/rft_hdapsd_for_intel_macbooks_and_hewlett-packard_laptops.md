<html><body><p>After quite some time (last release 01-04-2009), hdapsd got a bit of love.

Brice Arnould has contributed some code for Hewlett-Packard laptops (those supported by the hp_accel module, see <a href="http://git.kernel.org/?p=linux/kernel/git/torvalds/linux-2.6.git;a=blob;f=drivers/hwmon/hp_accel.c">drivers/hwmon/hp_accel.c</a>) and I finally crossed all lines and wrote support for Apple MacBooks (the Intel ones, via applesmc module, see <a href="http://git.kernel.org/?p=linux/kernel/git/torvalds/linux-2.6.git;a=blob;f=drivers/hwmon/applesmc.c">drivers/hwmon/applesmc.c</a>).

The HP code is interesting, as it support a hardware-logic mode, where hdapsd only parks the heads when told so by the HP hardware. As I do not own any compatible hardware, this is only tested by Brice himself.

The Apple SMC code isn't tested at all, as I don't have the hardware either.

That's why I want <strong>YOU</strong> to test it further (both, on HP and Apple) and report me bugs (mail to evgeni@debian.org preferred) if you find any :)

You can get the latest source either via git from github:

</p><pre>git clone -b new-interfaces git://github.com/evgeni/hdapsd.git</pre>

Or from githubs tarball generator: <a href="http://github.com/evgeni/hdapsd/tarball/eb711f30395ac9bc682b14c22d8445b7ddf0b4a0">http://github.com/evgeni/hdapsd/tarball/eb711f30395ac9bc682b14c22d8445b7ddf0b4a0</a>

After you got the source, a simple

<pre>./autogen.sh

make</pre>

should produce a <strong>src/hdapsd</strong> binary, that you can test.

I can provide Debian and Ubuntu .debs if needed too.</body></html>