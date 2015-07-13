<html><body><p>Some time ago I started using <a href="http://git.or.cz/" taget="_blank">Git</a>. First for fetching the latest versions of drivers (radeon and radeonhd) and now also for storing my own stuff in it. I won't tell you, why git is so good and so sexy, and why all the other systems suck (well, some really do, some not), but just how to setup a repository and publish it to everyone.<br>

<br>

Imagine you have two computers, one called <strong>client</strong>, and one called <strong>server</strong>. On the client you will create a repository, push it to the server and from there anyone will be able to fetch it via git or http (or view it via gitweb).<br>

For easier reading, I will mark shell-commands on the server with a s, and on the client with a c. Additionally I will add an $ for user-run commands, and # for root-run. So a command run as root on the server would look like:<br>

<strong>s# command</strong><br>

<br>

The first step is (as usual) installing some packages. On the client-side <strong>git-core</strong> should be enough, but don't miss the completion of zsh - you'll love it. On the server-side you need <strong>git-core, git-daemon-run and gitweb</strong>, you also need an cgi-enabled webserver (I use Apache here, but won't talk about it largely).<br>

<br>

Now we can create a repository on the client:<br>

<strong>c$ mkdir ~/gittest</strong><br>

<strong>c$ cd ~/gittest</strong><br>

<strong>c$ git-init-db</strong> (or git-init when you use something never than Etch)<br>

put some files into ~/gittest and read the nice <a href="http://zrusin.blogspot.com/2007/09/git-cheat-sheet.html" target="_blank">git cheat sheet</a><br>

<strong>c$ git-add .</strong><br>

<strong>c$ git-commit</strong><br>

<br>

You now have a git-repository on your computer. This repository can be pushed to the server.<br>

<br>

On the server we need a directory where the stuff will go, e.g. ~/gittest/.<br>

<strong>s$ mkdir ~/gittest</strong><br>

<strong>s$ cd ~/gittest</strong><br>

<strong>s$ git-init-db</strong> (or git-init when you use something never than Etch)<br>

<br>

The server-side is ready for receiving the data, so on the client we do:<br>

<strong>c$ git-push ssh://server/~/gittest master</strong><br>

&lt;type in your ssh password&gt;<br>

The repo should be synced now and ready for going public.<br>

<br>

For gitweb, just login as root on your server and do the following:<br>

<strong>s# cd /var/cache/git</strong><br>

<strong>s# ln -s ~user/gittest/.git/ gittest</strong> (note the .git folder!)<br>

<br>

http://server/cgi-bin/gitweb.cgi/ should now list the gittest repository and you are done.<br>

<br>

So gitweb is done, git:// and http:// fetching to go.<br>

<br>

Let's start with git:// one, this is done by git-daemon. It is already running, as you have installed git-daemon-run.<br>

But the repository is not exported by default, you need to do a <br>

s$ touch ~/gittest/.git/git-daemon-export-ok[/b]<br>

And ready, git-daemon exports the repository to git://server/git/gittest/<br>

<br>

What comes after git://? Right, http://!<br>

This looks easy, but has a nice possibility to fail, so read on.<br>

The webserver should be configured to follow symlinks, then (on the server):<br>

<strong>s# mkdir /var/www/git</strong><br>

<strong>s# cd /var/www/git</strong><br>

<strong>s# ln -s ~user/gittest/.git/ gittest</strong> (note the .git folder!)<br>

From now, you can access the gittest folder by http://server/git/gittest, but git cannot. git clone fails with something like:<br>

<br>

Initialized empty Git repository in /home/zhenech/gittest/.git/<br>

cat: /home/zhenech/gittest/.git/refs/remotes/origin/master: Datei oder Verzeichnis nicht gefunden<br>

cd: 464: can't cd to /home/zhenech/gittest/.git/refs/remotes/origin<br>

fatal: : not a valid SHA1<br>

fatal: Not a valid object name HEAD<br>

<br>

The solution is easy, but I needed about an hour to find it. Just run the following command on the server:<br>

<strong>s$ git-update-server-info</strong><br>

<br>

As you will need to run it, after each git push, just enable the post-update hook of the repository, by doing:<br>

<strong>s$ chmod +x ~gittest/.git/hooks/post-update</strong><br>

<br>

Now you're done, and your repository is available via gitweb, git:// and http://<br>

But you probably want to have a look at <strong>.git/description</strong> and <strong>.git/cloneurl</strong>. The first one contains the description (really!) of the repository, this will be shown by gitweb, and the second contains urls, one per line, those will also be shown by gitweb, so your users will know where actually to fetch the stuff.</p></body></html>