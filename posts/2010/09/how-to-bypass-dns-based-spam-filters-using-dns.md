<html><body><p>I've been sitting on this one since more than a month. I've contacted upstream on the 19.08.2010 and the Debian maintainer on the 02.09.2010. No reaction from them till today, and no, my spamfilter does not eat mail ;)



Still, I won't tell you the name of the software (but you could easily guess or check...)



So let's put the grey hat on and begin ;)



Foreword: when I write spam-filter, I mean some DNSBL/SPF/blah filter, not SpamAssassin, crm114 or other content-based filters.

</p><h2>common spam-filters</h2>

There are plenty of spam-filters out there which work after the following schema:

<pre>for check in checks:

    if check(mail) == BAD:

        reject(mail)

        break</pre>

And the checks often look like this:

<pre>def check(mail):

    errors = False

    result = some_magic(mail)

    if not errors: return result

    else: return GOOD</pre>

Here <code>some_magic</code> is a function that do the actual checks (DNSBL lookups etc) and which stores possible happened errors in <code>errors</code>. If an error occurred, it's safer to say the mail was good (or at least not bad) than bad.

<h2>the problem</h2>

This looks like a sane approach on the first sight: iterate over all checks and execute them until a mail is found to be spam (and the corresponding check did not end up in an error (imagine some weird DNS error for DNSBL or SPF checks here)). But then the author realizes that the errors might be "global", like with DNS: when the first check notices that it can't resolve anything (ie. it ran into a DNS timeout three times in a row), the second check (which also utilizes DNS queries) will most probably result in an error too. After this he adds a global counter for DNS errors and skips all the checks that use DNS if this counter is &gt;=3. "Great idea", you say, "saving resources is good". "Bad idea", I say...



The reason is simple: DNSError != DNSError. Why? The local resolver might be broken, then every DNS query will end up with an error and DNS-based checks should be really disabled. The first three (out of eg. ten) DNSBLs might be down, but that's not a reason to skip the other seven and the SPF check. Etc...



Now let's assume all configured DNSBLs are working properly, so is the local resolver and the checks are:

<pre>checks = [check_HELO, check_SPF, check_DNSBL]</pre>

How could one attack this filter?

<h2>the attack</h2>

Set up the following zone

<pre>spam.example.com IN NS ns1.example.com

spam.example.com IN NS ns2.example.com

spam.example.com IN NS ns3.example.com

spam2.example.com IN MX mx1.spam.example.com

spam2.example.com IN MX mx2.spam.example.com

spam2.example.com IN MX mx3.spam.example.com

spam2.example.com IN MX mx4.spam.example.com

ns1.example.com IN A 10.1.1.1

ns2.example.com IN A 10.2.2.2

ns3.example.com IN A 10.3.3.3</pre>

and greet the to-be-spammed-MTA with <code>EHLO client1.spam.example.com</code>

What happens? The spam-filter tries to resolve client1.spam.example.com in check_HELO to check whether the hostname matches the IP-address the connection is coming from, fails three times (there are no reachable DNS servers in 10.0.0.0/8) and continues with the next two checks, but these are skipped because of previous DNS errors. As no checks could identify the mail as being spam, the mail is delivered to the users mailbox.



With some creativity this can also be used in SPF records (via <code>spam2.example.com</code>), sender-domains etc.

<h2>conclusion</h2>

If you want to save resources by skipping DNS-based checks after another (DNS-based) check failed - don't! Think whether this is really the same error you are seeing...



Additionally this can be used as a sort of DoS against the not said software: according to the logs each of my tries needed between 30 and 36 seconds (!) to complete - imagine some hundred simultaneous requests...

<h2>the end</h2>

You think I did something wrong with that post? Throw the first stone then, I don't care.</body></html>