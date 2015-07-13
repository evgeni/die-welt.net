<html><body><p>Today I wanted to clone my <code>dotfiles</code> repository (<em>no, not available online, too much private stuff in there</em>) to a remote machine and noticed that it has grown way too big (20MiB working directory and about 200MiB in <code>.git</code>), so I decided to clean it up.



<code>git gc</code> did clean up a couple of megabytes, but <code>.git</code> was still about 190MiB, so I wasn't satisfied. Short thinking revealed the "lost" megabytes are somewhere in the history when I accidentally added some files and removed them afterwards (iceweasel, icedove, it's you I'm blaming ;)). But how the heck do I find and remove them?



<code>git filter-branch -f --index-filter 'git rm --cached --ignore-unmatch FILE' -- --all</code> will remove <code>FILE</code> from all commits, says <a href="http://linux.die.net/man/1/git-filter-branch">git-filter-branch(1)</a>, but how to find those files? They are not in my working directory anymore and I do not want to checkout every revision and look for big files in there. Let's ask git itself :)

<code>for commit in `git log --all --pretty=format:%H`; do git ls-tree -r -l $commit; done |awk '{print $4 " " $5}' |sort -nu</code> will show all files (actually all versions of all files) ever known to git, with the biggest ones at the end. Just identify the really big (unused) ones and remove them as above, thats what you think, right? Right, but <code>.git</code> won't be any smaller. Huh? Read <a href="http://linux.die.net/man/1/git-filter-branch">git-filter-branch(1)</a> again, just create a clone and it will be smaller, so mission accomplished! Now I had just 6MiB to push (compressed). For reference, the old tree would have used something about 150MiB to push.</p></body></html>