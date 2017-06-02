.. title: Breaking glass, OnePlus service and Android backups
.. slug: breaking-glass-oneplus-service-and-android-backups
.. date: 2017-06-02 23:31:00 UTC
.. tags: 
.. category: 
.. link: 
.. description: 
.. type: text

While visiting our Raleigh office, I managed to crack the glass on the screen of my OnePlus 3. Luckily it was a clean crack from the left upper corner, to the right lower one. The crack was not really interfering with neither touch nor display, so I had not much pressure in fixing it.

eBay lists new LCD sets for 110-130€, and those still require manual work of getting the LCD assembly out of the case, replacing it, etc. There are also glass-only sets for ~20€, but these require the complete removal of the glued glass part from the screen, and reattaching it, nothing you want to do at home. But there is also still the vendor, who can fix it, right? Internet suggested they would do it for about 100€, which seemed fair.

As people have been asking about the support experience, here is a quick write up what happened:

* Opened the RMA request online on Sunday, providing a brief description of the issue and some photos
* Monday morning answer from the support team, confirming this is way out of warranty, but I can get the device fixed for about 93€
* After confirming that the extra cost is expected, I had an UPS sticker to ship the device to `CTDI in Poland <https://oneplus.ctdipolska.pl/>`_
* UPS even tried a pick-up on Tuesday, but I was not properly prepared, so I dropped the device later at a local UPS point
* It arrived in Poland on Wednesday
* On Thursday the device was inspected, pictures made etc
* Friday morning I had a quote in my inbox, asking me to pay 105€ - the service partner decided to replace the front camera too, which was not part of the original 93€ approximation.
* Paid the money with my credit card and started waiting.
* The actual repair happened on Monday.
* Quality controlled on Tuesday.
* Shipped to me on Wednesday.
* Arrived at my door on Thursday.

All in all 9 working days, which is not great, but good enough IMHO. And the repair is good, and it was not (too) expensive. So I am a happy user of an OnePlus 3 again.

Well, almost. Before sending the device for repairs, had to take a backup and wipe it. I would not send it with my, even encrypted, data on it. And backups and Android is something special.

Android will backup certain data to Google, if you allow it to. `Apps can forbid that <https://developer.android.com/guide/topics/data/autobackup.html#EnablingAutoBackup>`_. Sadly this also blocks non-cloud backups with `adb backup`. So to properly backup your system, you either need root or you create a full backup of the system in the recovery and restore that.

I did the backup using `TWRP <https://twrp.me>`_, transferred it to my laptop, wiped the device, sent it in, got it back, copied the backup to the phone, restored it and... Was locked out of the device, it would not take my password anymore. Well, it seems that happens, `just delete some files <https://forums.oneplus.net/threads/fix-wrong-pin-pattern-when-restoring-twrp-nandroid-backup.452384/>`_ and it will be fine.

It's 2017, are backups of mobile devices really supposed to be that hard?!
