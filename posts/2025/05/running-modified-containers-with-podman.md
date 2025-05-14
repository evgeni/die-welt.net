<!--
.. title: running modified containers with podman
.. slug: running-modified-containers-with-podman
.. date: 2025-05-14 08:54:19 UTC
.. tags: english,linux,software,planet-debian
.. category: 
.. link: 
.. description: 
.. type: text
-->

Everybody (who runs containers) knows this situation: you've been running `happycontainer:stable` for a while and it's been great but now something external changed and you need to adjust the code while there is still no release with the patch.

I've encountered exactly this when our [Home-Assistant stopped showing the presence of our cat correctly](https://github.com/home-assistant/core/pull/143286), but we've also been [discussing this at work recently](https://github.com/theforeman/foreman-quadlet/issues/33).

Now the most obvious (to me?) solution would be to build a new container, based on the original one, and perform the modifications at build time.
Something like this:
```
FROM happycontainer:stable
RUN curl … | patch -p1
```

But that's not interactive, and if you don't have a patch readily available, that's not what you want.
(And I'll save you the idea of `RUN`ing `sed` and friends to alter files!)

You could run `vim` *inside* the container, but that requires `vim` to be installed there in the first place. And a reasonable configuration. And…

Well, turns out [podman can mount the root fs of a running container](https://docs.podman.io/en/latest/markdown/podman-mount.1.html).

```console
[root@sai ~]# podman mount homeassistant
/var/lib/containers/storage/overlay/f3ac502d97b5681989dff
```

And if you're running as non-root, you'll get an error:
```console
[container@sai ~]$ podman mount homeassistant
Error: cannot run command "podman mount" in rootless mode, must execute `podman unshare` first
```

Luckily the solution is in the error message - use [podman unshare](https://docs.podman.io/en/latest/markdown/podman-unshare.1.html)

```console
[container@sai ~]$ podman unshare
[root@sai ~]# podman mount homeassistant
/home/container/.local/share/containers/storage/overlay/95d3809d53125e4d40ad05e52efaa5a48e6e61fe9b8a8478416ff44459c7eb31/merged
```

So in both cases (root and rootless) we get a path, which is the mounted root fs and we can edit things in there as we like.

```console
[root@sai ~]# vi /home/container/.local/share/containers/storage/overlay/95d3809d53125e4d40ad05e52efaa5a48e6e61fe9b8a8478416ff44459c7eb31/merged/usr/src/homeassistant/homeassistant/components/surepetcare/binary_sensor.py
```

Once done, the container can be unmounted again, and the namespace left
```console
[root@sai ~]# podman umount homeassistant
homeassistant
[root@sai ~]# exit
[container@sai ~]$
```

At this point we have modified the code inside the container, but the running process is still using the old code. If we restart the container now to restart the process, our changes will be lost.

Instead, we can commit the changes as a new layer and tag the result.

```console
[container@sai ~]$ podman commit homeassistant docker.io/homeassistant/home-assistant:stable
```

And now, when we restart the container, it will use the new code with our changes 🎉
```console
[container@sai ~]$ systemctl --user restart homeassistant
```

Is this the best workflow you can get? Probably not.
Does it work? Hell yeah!
