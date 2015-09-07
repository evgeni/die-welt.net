<html><body><p>I've been a little sick the last days and decided to be productive instead of just drinking tea all the time.

The result are some (10) squashed bugs from pkg-games, and one long standing nmu.

</p><h2>adonthell</h2>
<a href="http://bugs.debian.org/624998">#624998</a> <a href="http://pad.lv/765984">LP#765984</a>
<strong>FTBFS: py_adonthell_wrap.cc:27357:44: error: taking address of temporary [-fpermissive]</strong>
Patch by Peter De Wachter, I just had to sign and upload.

<h2>alex4</h2>
<a href="http://bugs.debian.org/624884">#624884</a>
<strong>FTBFS: stat.h:106:22: error: expected identifier or '(' before '[' token</strong>
Include defs.h *after* particle.h, thus not redifining __unused from glibc's bits/stat.h

<h2>fenix</h2>
<a href="http://bugs.debian.org/554286">#554286</a> <a href="http://pad.lv/770962">LP#770962</a>
<strong>FTBFS with binutils-gold</strong>
Fixed since 0.92a.dfsg1-6, bug closed. Found different FTBFS though, fix uploaded as -9.

<h2>freeciv</h2>
<a href="http://bugs.debian.org/554411">#554411</a>
<strong>FTBFS with binutils-gold</strong>
Closed after verifying that it is fixed since at least 2.2.1 as upstream wrote.

<h2>kball</h2>
<a href="http://bugs.debian.org/624978">#624978</a>
<strong>FTBFS: src/gamemenu.cpp:224:52: error: 'mkdir' was not declared in this scope</strong>
Include sys/stat.h in 06_homedir_game.patch and 07_homedir_editor.patch.

<h2>kiki-the-nano-bot</h2>
<a href="http://bugs.debian.org/625047">#625047</a> <a href="http://pad.lv/770970">LP#770970</a>
<strong>FTBFS: ../src/../SWIG/KikiPy_wrap.cpp:13045:63: error: taking address of temporary [-fpermissive]</strong>
Patch by Peter De Wachter, I just had to sign and upload.

<h2>late</h2>
<a href="http://bugs.debian.org/624937">#624937</a> <a href="http://pad.lv/770857">LP#770857</a>
<strong>FTBFS: ball.h:113:19: error: 'NULL' was not declared in this scope</strong>
Include stddef.h in ball.h to define NULL.

<h2>libclaw</h2>
<a href="http://bugs.debian.org/625038">#625038</a> <a href="http://bugs.debian.org/624919">#624919</a> <a href="http://pad.lv/770805">LP#770805</a>
<strong>FTBFS: avl_base.hpp:137:15: error: 'ptrdiff_t' does not name a type</strong>
Patch by Julien Jorge, I just had to sign and upload.

<h2>liquidwar</h2>
<a href="http://bugs.debian.org/555468">#555468</a>
<strong>FTBFS with binutils-gold</strong>
Patch by Stephen Kitt, I just had to sign and upload.

<h2>lordsawar</h2>
<a href="http://bugs.debian.org/555564">#555564</a>
<strong>FTBFS with binutils-gold</strong>
Closed after verifying that it is fixed since at least 0.1.8

<h2>xnecview</h2>
<a href="http://bugs.debian.org/621392">#621392</a>
<strong>FTBFS on armel: expected identifier before numeric constant</strong>
R0 is already taken as a register name on armel, rename xnecview's constant to DEFFAULTR0. (Patch basically stolen from Ubuntu)</body></html>
