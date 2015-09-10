<html><body><p>Dear Lazyweb,<br>
<br>
Amazon's S3 services look very interesting for doing backups, but I can't find a perfect solution to integreate it into our current setup (using either rdiffbackup or rsnapshot).<br>
<br>
Did anyone of you ever used it in a similar way, and if so, how?<br>
My basic idea was:<br>
1. mount S3 (via FUSE?)<br>
2. mount some encrypted FS on top of it (EncFS?)<br>
3. run rdiffbackup/rsnapshot as usual on the resulting encrypted bucket<br>
<br>
Any suggestions on tools how to do this? Are <a href="http://code.google.com/p/s3fs">s3fs</a> and <a href="http://www.arg0.net/encfs">EncFS</a> what I'm looking for?</p></body></html>