<html><body><p>It's situation everyone knows: fighting spam is difficult. You either get still too much spam in your inbox or block some important mail because some blacklists goes crazy.<br>

Through <a href="http://planet.debian.net">planet debian</a> I read an <a href="http://blog.waja.info/2006/12/15/reduce-spam-significant/">article about policyd-weight at the cyconet blog</a> and found it very good. There is a software called policyd-weight, which checks the incoming mail agains several blacklists (like SpamHaus and RFC-Ignorant) and decides then if a mail should be blocked, because the sender is listed in many blacklists, or passed to the inbox, if the sender isn't listed at all, or only in one blacklist.<br>

<br>

The setup on Debian Etch with postfix is very easy:<br>

# apt-get install policyd-weight<br>

# policyd-weight defaults &gt; /etc/policyd-weight.conf<br>

# $EDITOR /etc/policyd-weight.conf<br>

and comment out the spamcop and manitu lines (I personally do not like spamcop and never heard before about the manitu one, maybe I'll read some stuff tomorrow.<br>

# /etc/init.d/policyd-weight restart<br>

# $EDITOR /etc/postfix/main.cf<br>

and remove all reject_rbl_client entries from smtpd_recipient_restrictions<br>

add check_policy_service inet:127.0.0.1:12525 instead<br>

# /etc/init.d/postfix reload<br>

<br>

You're ready, each mail is now checked by the policyd-weight and get's bounced if this nice peace of software thinks the sender is a bad boy.<br>

<br>

Tomorrow I'll write an email to my employer and hope he'll find this solution good too, because the only spam which get's through the policy is the one which is coming from my backup mx located at the server of the company I'm working for.<br>

<br>

Enjoy the almost spam-free world and don't forget to read /usr/share/doc/policyd-weight/documentation.txt.gz</p></body></html>