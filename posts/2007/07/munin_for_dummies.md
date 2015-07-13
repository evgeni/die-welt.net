<html><body><p>Yesterday, my server atuin (which is also serving this page) had some strange outtage. Packetloss at about 90%, even from the same rack (my boss has a server at the same hosting facility too, so I can test inhouse stuff ;)). About one hour later it was back. Without a reboot and without any interesting log-entries.<br>

So I thought, I should setup some kind of monitoring: munin.<br>

<br>

munin consists of two parts, a monitor and a node.<br>

The node is a server, which you can gets stats from. The monitor is a small app which collects the stats from the servers and paints nice html.<br>

<br>

The installation is quite easy.<br>

<br>

Run the following on the server you want to monitor:<br>

<br>

# apt-get install munin-node<br>

# $EDITOR /etc/munin/minun-node.conf<br>

host &lt;ipadress_where_munin_should_listen&gt;<br>

allow &lt;regex_of_ipadress_of_the_monitor&gt;<br>

# /etc/init.d/munin-node restart<br>

<br>

And this on the one which monitors:<br>

<br>

# apt-get install munin<br>

# $EDITOR /etc/munin/munin.conf<br>

[nodename]<br>

    address nodeip<br>

    use_node_name yes<br>

<br>

Wait some minutes and http://monitor/munin/ should show some nice graphs. Yay!<br>

<br>

I think I'll post some improved version of the ircu script tomorrow.</p></body></html>