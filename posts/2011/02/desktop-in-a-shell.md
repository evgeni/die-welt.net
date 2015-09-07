<html><body><p>People are using computers, everywhere, really! ;)

As you might guess correctly, so do I.

Basically, I am using three computers: my laptop (ThinkPad X201s, awesome machine, but pabs told me not to post any more adverts for ThinkPads on <a href="http://planet.debian.org">Planet Debian</a> *g*), my smartphone (Motorola Milestone, yes, that counts as a computer) and "random_pc" (for random as in my girlfriends or some other trusted (!!!) friends computer).

My laptop is running Debian GNU/Linux unstable with Xfce4.6, my smartphone is running Android 2.2.1 Froyo, my girlfriend has Ubuntu with GNOME, a friend runs Debian unstable with GNOME, another one Arch Linux with KDE4 and so on. And on all these machines I want be able to <strong>work</strong>, which means I have to read mail and rss, chat via IRC, <del>Jabber</del>XMPP and ICQ, have a look at my to-do list, ssh into different machines, write some code, tweet and dent etc.

In the following series of posts I will describe how I can handle about 90% of my work on every (trusted) computer out there, using ssh, screen, mutt, irssi, BitlBee, newsbeuter etc.

As I am describing the setup as a "Desktop in a shell", let's start with a login- and desktop/window-manager: ssh+screen.

</p><h1>ssh</h1>
Obviously, you need a machine to ssh into it, where the "Desktop" will live on. For me, that's my home router/fileserver/vm-server <code>dorei</code>, running Debian GNU/Linux <del datetime="2011-02-06T00:00:00+00:00">Lenny</del>Squeeze with OpenSSH as a kind of "login manager" ;)

Yes, my user is allowed to login with a password instead of a public key. And well, that's all for the login-manager, no extra configuration needed.

<h1>screen</h1>
After logging in, I start my "window-manager" with <code>screen -rd</code>, <code>-r</code> for reattach a running screen session, <code>-d</code> for detach it if it is already attached somewhere else. Or I can start a new session by just typing <code>screen</code>. Inside the screen I have multiple windows (one can create new ones with <code>^A c</code>) with all the needed software running. I can switch windows by pressing <code>^A N</code>, N being the number of the window, <code>^A n</code> for the next window, <code>^A p</code> for the previous one or <code>^A ^a</code> for the last one. Or I can get a window-list with <code>^A w</code>. If needed, I can rename windows with <code>^A A</code>, followed by the new name. That should be enough for almost everyone. Let's just add a window-list to the bottom (as you might have seen on GNOME, Xfce, KDE and even Windows ;) by adding the following to the <code>~/.screenrc</code>:

<pre>caption always " "                    # clear line before hardstatus
hardstatus alwayslastline "%{= kb}[ %{B}%H:$USER %{b}][ %=%{w}%?%-Lw%?%{b}(%{W}%n*%f %t%?(%u)%?%{b})%{w}%?%+Lw%?%?%= %{b}][%{B} %l %{B}%{W}%d.%0m %{b}]"</pre>
You get the current host- and username, the machine load and the date for free ;)

Even if it is possible, I do not have any "autostart" like stuff in my <code>.screenrc</code> as the machine is running stable and I start the screen and the apps inside maybe once a year after a reboot.

<h2>screenrc</h2>
My <code>.screenrc</code> looks like this:

<pre># detach on hangup
  autodetach on
# don't display the copyright page
  startup_message off
# set scrollback to 2000 lines, default 100
  defscrollback 2000
# set silencewait to 15 seconds, default 30
  silencewait 15
# new shells should be started as login-shells
  shell -$SHELL
# make a fancy statusline
  caption always " "                    # clear line before hardstatus
  hardstatus alwayslastline "%{= kb}[ %{B}%H:$USER %{b}][ %=%{w}%?%-Lw%?%{b}(%{W}%n*%f %t%?(%u)%?%{b})%{w}%?%+Lw%?%?%= %{b}][%{B} %l %{B}%{W}%d.%0m %{b}]"
# make higlighting bold, black on blue background
  sorendition +b bk
# some fixes, no I do not know where they come from :)
  termcap  xterm hs@:cs=\E[%i%d;%dr:im=\E[4h:ei=\E[4l
  terminfo xterm hs@:cs=\E[%i%p1%d;%p2%dr:im=\E[4h:ei=\E[4l
  termcapinfo  xterm Z0=\E[?3h:Z1=\E[?3l:is=\E[r\E[m\E[2J\E[H\E[?7h\E[?1;4;6l
  termcapinfo xterm* OL=100
  termcapinfo xterm 'VR=\E[?5h:VN=\E[?5l'
  termcapinfo xterm 'k1=\E[11~:k2=\E[12~:k3=\E[13~:k4=\E[14~'
  termcapinfo xterm 'kh=\EOH:kI=\E[2~:kD=\E[3~:kH=\EOF:kP=\E[5~:kN=\E[6~'
  termcapinfo xterm 'hs:ts=\E]2;:fs=\007:ds=\E]2;screen\007'
  termcapinfo xterm 'vi=\E[?25l:ve=\E[34h\E[?25h:vs=\E[34l'
  termcapinfo xterm 'XC=K%,%\E(B,[\304,\\\\\326,]\334,{\344,|\366,}\374,~\337'
  termcapinfo xterm* be
  termcapinfo xterm|xterms|xs ti@:te=\E[2J
  termcapinfo wy75-42 xo:hs@
  termcapinfo wy* CS=\E[?1h:CE=\E[?1l:vi=\E[?25l:ve=\E[?25h:VR=\E[?5h:VN=\E[?5l:cb=\E[1K:CD=\E[1J
  termcapinfo  hp700 'Z0=\E[?3h:Z1=\E[?3l:hs:ts=\E[62"p\E[0$~\E[2$~\E[1$}:fs=\E[0}\E[61"p:ds=\E[62"p\E[1$~\E[61"p:ic@'
  termcap  vt100* ms:AL=\E[%dL:DL=\E[%dM:UP=\E[%dA:DO=\E[%dB:LE=\E[%dD:RI=\E[%dC
  terminfo vt100* ms:AL=\E[%p1%dL:DL=\E[%p1%dM:UP=\E[%p1%dA:DO=\E[%p1%dB:LE=\E[%p1%dD:RI=\E[%p1%dC
  termcapinfo linux C8
# some bindings
  bind k
  bind ^k
  bind .
  bind ^\
  bind \\
  bind ^h
  bind h
  bind 'w' windowlist -b
  bind 'W' windows
  bind 'K' kill
  bind 'I' login on
  bind 'O' login off
  bind '}' history
  bind = resize =
  bind + resize +3
  bind - resize -3
# Mutt demands this
# http://wiki.mutt.org/?MuttFaq/Appearance
 defbce on
 term screen-bce</pre>

That's all for my screen setup. The obvious, boring screenshot follows:

<a href="/wp-content/uploads/2011/02/screen.png"><img class="alignnone size-medium wp-image-826" title="screen" src="https://www.die-welt.net/wp-content/uploads/2011/02/screen-300x171.png" alt="" width="300" height="171"></a>

See you next time, when I will present my mutt setup here.</body></html>
