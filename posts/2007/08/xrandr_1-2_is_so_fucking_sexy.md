<html><body><p>As already posted today, I now has (sorry jesse, it's just so fuckin' <strong>lol</strong> ;)) XRandR 1.2 support in my radeon driver.<br>
<br>
The card in my laptop (IBM [not Lenovo!] ThinkPad X31) is a <strong>ATI Technologies Inc Radeon Mobility M6 LY</strong> (a Radeon Mobility 7000) with a 1024x768 12" TFT. As 1024x768 is kinda small for everyday work, I have a 19" TFT with a 1280x1024 resolution on my table.<br>
Until today the second screen had to be connected to the laptop before Xorg started, so MergedFB could recognize and configure it. This is very annoying and it could be simplier... With XRandR 1.2 it IS! I just need to start my box as usual, open a terminal and run<br>
<strong>xrandr --output VGA-0 --right-of LVDS --mode 1280x1024 --rate 60</strong> (the --rate is special for my TFT, as it supports up to 75Hz, but is a bit blurry then, 60 works perfectly)<br>
<strong>BUT:</strong> xrandr: screen cannot be larger than 1600x1200 (desired size 2304x1024)<br>
WTF?! Kay, let's google around... Ah, fine I need to set my virtual screen to something bigger. So let's open <strong>/etc/X11/xorg.conf</strong>, find the Screen section, there the subsection Display and edit:<br>
        SubSection "Display"<br>
                Depth           24<br>
                Modes           "1024x768" "800x600" "640x480"<br>
                Virtual         2304 1024<br>
        EndSubSection<br>
        <br>
Restart Xorg, and have fun with your nice XRandR radeon :&gt;<br>
<br>
BTW, this is my third blogpost today, "I can has an award plz!? KTHXBYE" (sorry again, jesse)</p></body></html>