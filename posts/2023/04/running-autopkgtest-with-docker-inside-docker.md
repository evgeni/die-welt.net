<!--
.. title: Running autopkgtest with Docker inside Docker
.. slug: running-autopkgtest-with-docker-inside-docker
.. date: 2023-04-08 17:39:55 UTC
.. tags: english,linux,software,debian,planet-debian
.. category: 
.. link: 
.. description: 
.. type: text
-->

While I am not the biggest fan of Docker, I must admit it has quite some reach across various service providers and can often be seen as an API for running things in isolated environments.

One such service provider is GitHub when it comes to their Actions service.

I have no idea what isolation technology GitHub uses on the outside of Actions, but inside you just get an Ubuntu system and can run whatever you want via Docker as that comes pre-installed and pre-configured. This especially means you can run things inside vanilla Debian containers, that are free from any GitHub or Canonical modifications one might not want ;-)

So, if you want to run, say, `lintian` from `sid`, you can define a job to do so:

```yaml
  lintian:
    runs-on: ubuntu-latest
    container: debian:sid
    steps:
      - [ do something to get a package to run lintian on ]
      - run: apt-get update
      - run: apt-get install -y --no-install-recommends lintian
      - run: lintian --info --display-info *.changes
```

This will run on Ubuntu (`latest` right now means 22.04 for GitHub), but then use Docker to run the [`debian:sid`](https://hub.docker.com/_/debian) container and execute all further steps *inside* it.
Pretty short and straight forward, right?

Now `lintian` does *static* analysis of the package, it doesn't need to install it.
What if we want to run `autopkgtest` that performs tests on an actually installed package?

`autopkgtest` comes with various "virt servers", which are providing isolation of the testbed, so that it does not interfere with the host system.
The simplest available virt server, [`autopkgtest-virt-null`](https://manpages.debian.org/testing/autopkgtest/autopkgtest-virt-null.1.en.html) doesn't actually provide any isolation, as it runs things directly on the host system.
This might seem fine when executed inside an ephemeral container in an CI environment, but it also means that multiple tests have the potential to influence each other as there is no way to revert the testbed to a clean state.
For that, there are other, "real", virt servers available: [`chroot`](https://manpages.debian.org/testing/autopkgtest/autopkgtest-virt-chroot.1.en.html), [`lxc`](https://manpages.debian.org/testing/autopkgtest/autopkgtest-virt-lxc.1.en.html), [`qemu`](https://manpages.debian.org/testing/autopkgtest/autopkgtest-virt-qemu.1.en.html), [`docker`](https://manpages.debian.org/testing/autopkgtest/autopkgtest-virt-docker.1.en.html) and [many more](https://manpages.debian.org/testing/autopkgtest/index.html).
They all have one in common: to use them, one needs to somehow provide an "image" (a prepared chroot, a tarball of a chroot, a vm disk, a container, …, you get it) to operate on and most either bring a tool to create such an "image" or rely on a "registry" (online repository) to provide them.

Most users of `autopkgtest` on GitHub (that I could find with their terrible search) are using either the `null` or the `lxd` virt servers. Probably because these are dead simple to set up (`null`) or the most "native" (`lxd`) in the Ubuntu environment.

As I wanted to execute multiple tests that for sure would interfere with each other, the `null` virt server was out of the discussion pretty quickly.

The `lxd` one also felt odd, as that meant I'd need to set up lxd (can be done in a few commands, but still) and it would need to download stuff from Canonical, incurring costs (which I couldn't care less about) and taking time which I *do* care about!).

Enter [`autopkgtest-virt-docker`](https://manpages.debian.org/testing/autopkgtest/autopkgtest-virt-docker.1.en.html), which [recently](https://bugs.debian.org/747909) [was added](https://salsa.debian.org/ci-team/autopkgtest/-/commit/4779b706dce41b75686ff29b5057b8c36945813d) to `autopkgtest`! No need to set things up, as GitHub already did all the Docker setup for me, and almost no waiting time to download the containers, as GitHub does heavy caching of stuff coming from Docker Hub (or at least it feels like that).

The only drawback? It was added in `autopkgtest` 5.23, which Ubuntu 22.04 doesn't have.
"We need to go deeper" and run `autopkgtest` from a `sid` container!

With this idea, our current job definition would look like this:

```yaml
  autopkgtest:
    runs-on: ubuntu-latest
    container: debian:sid
    steps:
      - [ do something to get a package to run autopkgtest on ]
      - run: apt-get update
      - run: apt-get install -y --no-install-recommends autopkgtest autodep8 docker.io
      - run: autopkgtest *.changes --setup-commands="apt-get update" -- docker debian:sid
```

(`--setup-commands="apt-get update"` is needed as the container comes with an empty `apt` cache and wouldn't be able to find dependencies of the tested package)

However, this will fail:

```console
# autopkgtest *.changes --setup-commands="apt-get update; sed -i 's/exit 101/exit 0/' /usr/sbin/policy-rc.d" -- docker debian:sid
autopkgtest [10:20:54]: starting date and time: 2023-04-07 10:20:54+0000
autopkgtest [10:20:54]: version 5.28
autopkgtest [10:20:54]: host a82a11789c0d; command line: /usr/bin/autopkgtest bley_2.0.0-1+gha+20230407101935+evgeni.patch.1_amd64.changes '--setup-commands=apt-get update' -- docker debian:sid
Unexpected error:
Traceback (most recent call last):
  File "/usr/share/autopkgtest/lib/VirtSubproc.py", line 829, in mainloop
    command()
  File "/usr/share/autopkgtest/lib/VirtSubproc.py", line 758, in command
    r = f(c, ce)
        ^^^^^^^^
  File "/usr/share/autopkgtest/lib/VirtSubproc.py", line 692, in cmd_copydown
    copyupdown(c, ce, False)
  File "/usr/share/autopkgtest/lib/VirtSubproc.py", line 580, in copyupdown
    copyupdown_internal(ce[0], c[1:], upp)
  File "/usr/share/autopkgtest/lib/VirtSubproc.py", line 607, in copyupdown_internal
    copydown_shareddir(sd[0], sd[1], dirsp, downtmp_host)
  File "/usr/share/autopkgtest/lib/VirtSubproc.py", line 562, in copydown_shareddir
    shutil.copy(host, host_tmp)
  File "/usr/lib/python3.11/shutil.py", line 419, in copy
    copyfile(src, dst, follow_symlinks=follow_symlinks)
  File "/usr/lib/python3.11/shutil.py", line 258, in copyfile
    with open(dst, 'wb') as fdst:
         ^^^^^^^^^^^^^^^
FileNotFoundError: [Errno 2] No such file or directory: '/tmp/autopkgtest-virt-docker.shared.kn7n9ioe/downtmp/wrapper.sh'
autopkgtest [10:21:07]: ERROR: testbed failure: unexpected eof from the testbed
```

Running the same thing locally of course works, so there has to be something special about the setup at GitHub. But what?!

A bit of digging revealed that `autopkgtest-virt-docker` tries to use a shared directory (using Dockers `--volume`) to exchange things with the testbed (for the `downtmp-host` capability). As my `autopkgtest` is running inside a container itself, nothing it tells the Docker deamon to mount will be actually visible to it.

In retrospect this makes total sense and `autopkgtest-virt-docker` has a switch to "fix" the issue: `--remote` as the Docker deamon is *technically* remote when viewed from the place `autopkgtest` runs at.

I'd argue this is not a bug in `autopkgtest(-virt-docker)`, as the situation is actually cared for. There is even some auto-detection of "remote" daemons in the code, but that doesn't "know" how to detect the case where the daemon socket is mounted (vs being set as an environment variable). I've opened an MR ([assume remote docker when running inside docker](https://salsa.debian.org/ci-team/autopkgtest/-/merge_requests/221)) which should detect the case of running inside a Docker container which kind of implies the daemon is remote.

Not sure the patch will be accepted (it *is* a band-aid after all), but in the meantime I am quite happy with using `--remote` and so could you ;-)
