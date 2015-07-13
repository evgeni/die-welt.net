<html><body><p>Yesterday I decided to reinstall my Windows XP on my Thinkpad Z61m. As I have the nice 7CD recovery set from IBM, I thought I'll just use it. ThinkWiki said, it would only remove the first partition on my drive and push its data there.<br>

Well, it didn't.<br>

I did not have any own recovery discs, so I just could do a "full factory reset", which wiped my whole disk :(<br>

It didn't really wipe it, but deleted the partition table, created one big FAT partition, and one small (5GB) for the "Rescue and Recovery" tool. Only the first 8GB of the big one were filled with new data, the rest was not touched. The 5GB one was almost full.<br>

<br>

Now I was fucked. I had backups of my home, but they were not completely up to date, and I did not have any backups of /...<br>

So lets try some recovery.<br>

<br>

I know my disk looked like this before RnR destroyed the partition table:<br>

sda1: 10GB WinXP NTFS<br>

sda2: 10GB Linux ext3 (/)<br>

sda3: 1GB Linux swap (encrypted with LUKS)<br>

sda4: 75GB Linux ext3 (/home, encrypted with LUKS)<br>

<br>

Now I boot grml and use gpart (it guesses the partitions of disk), to get the real start- and end-sectors of the partitions, as they have to match exactly:<br>

<strong># gpart -f -l gpart.log -v /dev/sda</strong><br>

This needs about an hour for my 100GB disk, so get some coffee ;)<br>

<br>

When it was done, I opened gpart.log and got some entries like this one:<br>

  type: 005(0x05)(Extended DOS)<br>

  size: 10144mb #s(20775888) s(8192016-28967903)<br>

  chs:  (1023/15/63)-(1023/15/63)d (8127/0/1)-(28737/15/63)r<br>

  <br>

The "size" line looks interesing, it shows the size of the guessed partition and the start and end sectors, exactly what I wanted.<br>

Two of the entries were ext3 (10GB) and swap (1GB), that are my / and swap, but no /home (and not the old NTFS, it was overwritten).<br>

<br>

So I started fdisk and deleted the two IBM partitions, then I switched to sectors-view (press "u"&lt;ENTER&gt;).<br>

Then I created 4 primary partitions from the data I got from gpart:<br>

sda1: 63-&lt;first of ext3-1&gt;<br>

sda2: &lt;first of ext3&gt;-&lt;last of ext3&gt;<br>

sda3: &lt;first of swap&gt;-&lt;last of swap&gt;<br>

sda4: &lt;last of swap+1&gt;-&lt;end&gt;<br>

<br>

The partition table was back, now I tried to reach my data.<br>

sda2 was perfectly mountable and contained all my / - nice!<br>

sda3 could be opened with cryptsetup luksOpen and contained swap - nice!<br>

sda4 - which SHOULD contain my /home - could NOT be opened with luks :(<br>

<br>

I posted on the luks/dm-crypt mailing-list about my problem, and got the answer, I should search for the "LUKS 0xBA 0xBE" (= LUKS BABE, funny developers) header of the luks partition (I assumend the start of sda4 was wrong).<br>

This was did by: <strong>hexdump -C /dev/sdaX |grep "4c 55 4b 53 ba be"</strong><br>

where X was 3 and 4, as I did not know, where exactly sda4 should start (maybe IN the swap? :()<br>

sda3 contained only one header at offset 0, so the real header of the luks-swap.<br>

sda4 contained one too, but not at offset 0 (where cryptsetup searched it), but at 0x00000600 (1536 decimal).<br>

<br>

So I just needed to push the start of sda4 a bit, open fdisk, remember sector where sda4 begins, remove sda4.<br>

Now I need to know how many sectors I should add. fdisk tells me, 1 sector=512 bytes, my offset was 1536 bytes, so exactly 3 sectors. I create a new sda4, but now it starts 3 sectors later, write the partition table, and reboot (fdisk told me to, don't ask me why).<br>

<br>

After the reboot, <strong>head -c4 /dev/sda4</strong> says "LUKS", yay. cryptsetup isLuks reports partition being LUKS too, and luksOpen opens it. So I have my partition back, but what is about the data (the last 5GB were overwritten).<br>

mount mounts it without problems, but I wanted to ask fsck.<br>

<strong>fsck /dev/mapper/home</strong> gave many inode errors, so I ran<br>

<strong>fsck -y /dev/mapper/home</strong> after some time it was ready and had my data.<br>

<br>

Now I can be really happy getting my stuff back, thanks open source, damn lenovo.</p></body></html>