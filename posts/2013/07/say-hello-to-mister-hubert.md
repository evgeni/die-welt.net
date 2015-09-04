<html><body><p>Some days ago I got myself a new shiny Samsung 840 Pro 256GB SSD for my laptop. The old 80GB Intel was just too damn small.



Instead of just doing a <code>pvmove</code> from the old to the new, I decided to set up the system from scratch. That is an awesome way to get rid of old and unused stuff or at least move it to some lower class storage (read: backup). One of the things I did not bother to copy from the old disk were my <code>~/Debian</code>, <code>~/Grml</code> and <code>~/Devel</code> folders. I mean, hey, it's all in some kind of VCS, right? I can just clone it new, if I really want. Neither I copied much of my dotfiles, these are neatly gitted with the help of RichiH's awesome <a href="https://github.com/RichiH/vcsh"><code>vcsh</code></a> and a bit of human brains (no private keys on GitHub, yada yada).



After cloning a couple of my personal repos from GitHub to <code>~/Devel</code>, I realized I was doing a pretty dumb job, a machine could do for me. As I already was using Joey's <a href="http://myrepos.branchable.com/"><code>mr</code></a> for my <code>vcsh</code> repositories, generating a <code>mr</code> config and letting <code>mr</code> do the actual job was the most natural thing to do. So was using <a href="http://docs.python-requests.org/en/latest/">Python Requests</a> and <a href="http://developer.github.com/v3/">GitHub's JSON API</a>.



And here is Mister Hubert, aka <code>mrhub</code>: <a href="https://github.com/evgeni/MisterHubert">github.com/evgeni/MisterHubert</a>.



Just call it with your GitHub username and you get a nice <code>mr</code> config dumped to stdout. Same applies for organizations.

</p><ul>

<li>Authentication for private repos? ✓ (-p)</li>

<li>Other clone mechanisms? ✓ (-c)</li>

<li>A help function? ✓ (-h)</li>

<li>Other features? <a href="https://github.com/evgeni/MisterHubert/fork">✓</a></li>

</ul>

As usual, I hope this is useful :)</body></html>
