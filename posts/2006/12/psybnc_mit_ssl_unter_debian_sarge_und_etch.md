<html><body><p>See below for english version.<br>
<br>
<strong>SSL-Support: Yes, but no openssl binary found in "/usr/bin"</strong><br>
<br>
Da in #psybnc oft gefragt wird, wie man psyBNC unter Debian GNU/Linux mit SSL zum laufen kriegt, und ich immer die selbe Antwort geben muss um ein "ja, es funktioniert, danke" zu hören, hier ein kleines HowTo.<br>
<br>
1. das aktuelle psyBNC Source besorgen und entpacken<br>
2. openssl und libssl-dev installieren:<br>
<strong># apt-get install openssl libssl-dev</strong><br>
3. <strong>make menuconfig</strong> im psyBNC Ordner machen und als SSL-Path <strong>/usr</strong> angeben.<br>
4. psyBNC ganz normal mit <strong>make</strong> bauen und Freude mit einem SSL fähigem Bouncer haben.<br>
<br>
<strong>English:</strong><br>
I'm often asked in #psybnc how to setup psybnc with ssl under Debian, so here are the needed steps to get it running.<br>
<br>
1. get the latest psyBNC source and unzip it.<br>
2. get the openssl and libssl-dev packages:<br>
<strong># apt-get install openssl libssl-dev</strong><br>
3. call <strong>make menuconfig</strong> in the psyBNC directory and set the SSL-Path to <strong>/usr</strong><br>
4. compile it wit <strong>make</strong> and have a fully working bouncer with ssl</p></body></html>