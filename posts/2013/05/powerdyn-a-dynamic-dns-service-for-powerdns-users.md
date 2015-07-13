<html><body><p>You may not know this, but I am a <em>huge</em> PowerDNS fan. This may be because it is so simple to use, supports different databases as backends or maybe just because I do not like BIND, pick one.



I also happen to live in Germany where ISPs usually do not give static IP-addresses to private customers. Unless you pay extra or limit yourself to a bunch of providers that do good service but rely on old (DSL) technology, limiting you to some 16MBit/s down and 1MBit/s up. Luckily my ISP does not force the IP-address change, but it does happen from time to time (once in a couple of month usually). To access the machine(s) at home while on a non-IPv6-capable connection, I have been using my old (old, old, old) DynDNS.com account and pointing a CNAME from under die-welt.net to it.



Some time ago, DynDNS.com started supporting AAAA records in their zones and I was happy: no need to type hostname.ipv6.kerker.die-welt.net to connect via v6 -- just let the application decide. Well, yes, almost. It's just DynDNS.com resets the AAAA record when you update the A record with ddclient and there is currently no IPv6 support in any of the DynDNS.com clients for Linux. So I end up with no AAAA record and am not as happy as I should be.



Last Friday I got a mail from DynDNS:

</p><blockquote>Starting now, if you would like to maintain your free Dyn account, you must now log into your account once a month. Failure to do so will result in expiration and loss of your hostname. Note that using an update client will no longer suffice for this monthly login. You will still continue to get email alerts every 30 days if your email address is current.

Yes, thank you very much...</blockquote>

Given that I have enough nameservers under my control and love hacking, I started writing an own dynamic DNS service. Actually you cannot call it a service. Or dynamic. But it's my own, and it does DNS: <a href="https://github.com/evgeni/powerdyn">powerdyn</a>. It is actually just a script, that can update DNS records in SQL (from which PowerDNS serves the zones).



When you design such a "service", you first think about user authentication and proper information transport. The machine that runs my PowerDNS database is reachable via SSH, so let's use SSH for that. You do not only get user authentication, server authentication and properly crypted data transport, you also do not have to try hard to find out the IP-address you want to update the hostname to, just use <code>$SSH_CLIENT</code> from your environment.



If you expected further explanation what has to be done next: sorry, we're done. We have the user (or hostname) by looking at the SSH credentials, and we have the IP-address to update it to if the data in the database is outdated. The only thing missing is some execution daemon or ... <code>cron(8)</code>. :)



The machine at home has the following cron entry now:

<pre><code>*/5 * * * * ssh -4 -T -i /home/evgeni/.ssh/powerdyn_rsa powerdyn@ssh.die-welt.net

</code></pre>

This connects to the machine with the database via v4 (my IPv6 address does not change) and that's all.

As an alternative, one can add the <code>ssh</code> call in <code>/etc/network/if-up.d/</code>, <code>/etc/ppp/ip-up.d/</code> or <code>/etc/ppp/ipv6-up.d</code> (depending on your setup) to be executed every time the connection goes up.



The machine with the database has the following <code>authorized_keys</code> entry for the <code>powerdyn</code> user:

<pre><code>no-agent-forwarding,no-port-forwarding,no-pty,no-X11-forwarding,no-user-rc,\ 

command="/home/powerdyn/powerdyn/powerdyn dorei.kerker.die-welt.net" ssh-rsa AAAA... evgeni@dorei

</code></pre>

By forcing the <code>command</code>, the user has no way to get the database-credentials the script uses to write to the database and neither cannot update a different host. That seems secure enough for me. It won't scale for a setup as DynDNS.com and the user-management sucks (you even have to create the entries in the database first, the script can only update them), but it works fine for me and I bet it would for others too :)



<i>Update:</i> included suggestions by XX and Helmut from the comments.</body></html>