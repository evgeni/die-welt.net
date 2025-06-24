<!--
.. title: Using LXCFS together with Podman
.. slug: using-lxcfs-together-with-podman
.. date: 2025-06-24 19:46:34 UTC
.. tags: english,linux,planet-debian,software,containers
.. category: 
.. link: 
.. description: 
.. type: text
-->

[JP](https://jpmens.net/) was puzzled that [using `podman run --memory=2G …` would not result in the 2G limit being visible inside the container](https://mastodon.social/@jpmens/114739374946337243).
While we were able to identify this as a visualization problem — tools like `free(1)` only look at `/proc/meminfo` and that is not virtualized inside a container, you'd have to look at `/sys/fs/cgroup/memory.max` and friends instead — I couldn't leave it at that.
And then I remembered there is actually something that can provide a virtual (cgroup-aware) `/proc` for containers: [LXCFS](https://linuxcontainers.org/lxcfs/introduction/)!

But does it work with Podman?!
I always used it with LXC, but there is technically no reason why it wouldn't work with a different container solution — cgroups are cgroups after all.

As we all know: there is only one way to find out!

Take a fresh Debian 12 VM, install `podman` and verify things behave as expected:

```console
user@debian12:~$ podman run -ti --rm --memory=2G centos:stream9
bash-5.1# grep MemTotal /proc/meminfo
MemTotal:        6067396 kB
bash-5.1# cat /sys/fs/cgroup/memory.max
2147483648
```

And after installing (and starting) `lxcfs`, we can use the virtual `/proc/meminfo` it generates by bind-mounting it into the container (LXC does that part automatically for us):

```console
user@debian12:~$ podman run -ti --rm --memory=2G --mount=type=bind,source=/var/lib/lxcfs/proc/meminfo,destination=/proc/meminfo centos:stream9
bash-5.1# grep MemTotal /proc/meminfo
MemTotal:        2097152 kB
bash-5.1# cat /sys/fs/cgroup/memory.max
2147483648
```

The same of course works with all the other proc entries `lxcfs` provides (`cpuinfo`, `diskstats`, `loadavg`, `meminfo`, `slabinfo`, `stat`, `swaps`, and `uptime` here), just bind-mount them.

And yes, `free(1)` now works too!

```console
bash-5.1# free -m
               total        used        free      shared  buff/cache   available
Mem:            2048           3        1976           0          67        2044
Swap:              0           0           0
```

Just don't blindly mount the whole `/var/lib/lxcfs/proc` over the container's `/proc`.
It did work (as in: "`bash` and `free` didn't crash") for me, but with `/proc/$PID` etc missing, I bet things will go south pretty quickly.
