<!--
.. title: I just want to run this one Python script
.. slug: i-just-want-to-run-this-one-python-script
.. date: 2021-11-06 19:03:45 UTC
.. tags: english,planet-debian,software,linux
.. category: 
.. link: 
.. description: 
.. type: text
-->

So I couldn't sleep the other night, and my brain wanted to think about odd problems…

Ever had a script that's compatible with both, Python 2 and 3, but you didn't want to bother the user to know which interpreter to call? Maybe because the script is often used in environments where only one Python is available and users just expect things to work? And it's only that one script file, no package, no additional wrapper script, nothing.

Yes, this is a rather odd scenario. And yes, using Python doesn't make it easier, but trust me, you wouldn't want to implement the same in bash.

Nothing that you will read from here on should ever be actually implemented, it will summon dragons and kill kittens. But it was a fun midnight thought, and I like to share nightmares!

The nice thing about Python is it supports [docstrings](https://en.wikipedia.org/wiki/Docstring), essentially strings you can put inside your code which are kind of comments, but without being hidden inside commnent blocks. These are often used for documentation that you can reach using Python's `help()` function. (Did I mention I *love* `help()`?)

Bash on the other hand, does not support docstrings. Even better, it doesn't give a damn whether you quote commands or not. You can call `"ls"` and you'll get your directory listing the same way as with `ls`.

Now, nobody would — under normal circumstances — quote `ls`. Parameters to it, sure, those can contain special characters, but `ls`?!

Another nice thing about Python: it doesn't do any weird string interpolation by default (ssssh, [f-strings are cool](https://www.python.org/dev/peps/pep-0498/), but not *default*). So `"$(ls)"` is exactly that, a string containing a Dollar sign, an open parenthesis, the characters "l" and "s" and a closing parenthesis.

Bash, well, Bash will run `ls`, right?

If you don't yet know where this is going, you have a clean mind, enjoy it while it lasts!

So another thing that Bash has is [`exec`](https://www.gnu.org/savannah-checkouts/gnu/bash/manual/bash.html#Shell-Builtin-Commands): "replace[s] the shell without creating a new process". That means that if you write `exec python` in your script, the process will be replaced with Python, and when the Python process ends, your script ends, as Bash isn't running anymore. Well, technically, your script ended the moment `exec` was called, as at that point there was no more Bash process to execute the script further.

Using `exec` is a pretty common technique if you want to setup the environment for a program and then call it, without Bash hanging around any longer as it's not needed.

So we could have a script like this:

```bash
#!/bin/bash
exec python myscript.py "$@"
```

Here `"$@"` essentially means "pass all parameters that were passed to this Bash script to the Python call" (see [parameter expansion](https://www.gnu.org/savannah-checkouts/gnu/bash/manual/bash.html#Shell-Parameter-Expansion)).

We could also write it like this:

```bash
#!/bin/bash
"exec" "python" "myscript.py" "$@"
```

As far as Bash is concerned, this is the same script. But it just became valid Python, as for Python those are just docstrings.

So, given this is a valid Bash script *and* a valid Python script now, can we make it do something *useful* in the Python part? Sure!

```bash
#!/bin/bash
"exec" "python" "myscript.py" "$@"
print("lol")
```

If we call this using Bash, it never gets further than the `exec` line, and when called using Python it will print `lol` as that's the only effective Python statement in that file.

Okay, but what if this script would be called `myscript.py`? Exactly, calling it with Python would print `lol` and calling it with Bash would end up printing `lol` too (because it gets re-`exec`uted with Python).

We can even make it name-agnostic, as Bash knows the name of the script we called:

```bash
#!/bin/bash
"exec" "python" "$0" "$@"
print("lol")
```

But this is still calling `python`, and it could be `python3` on the target (or even something worse, but we're not writing a Halloween story here!).

Enter another Bash command: [`command`](https://www.gnu.org/savannah-checkouts/gnu/bash/manual/bash.html#Bash-Builtins) (SCNR!), especially "The -v option causes a single word indicating the command or file name used to invoke command to be displayed". It will also exit non-zero if the command is not found, so we can do things like `$(command -v python3 || command -v python)` to find *a* Python on the system.

```bash
#!/bin/bash
"exec" "$(command -v python3 || command -v python)" "$0" "$@"
print("lol")
```

Not well readable, huh? Variables help!

```bash
#!/bin/bash
__PYTHON="$(command -v python3 || command -v python)"
"exec" "${__PYTHON}" "$0" "$@"
print("lol")
```

For Python the variable assignment is just a var with a weird string, for Bash it gets executed and we store the result. Nice!

Now we have a Bash header that will find a working Python and then re-execute itself using said Python, allowing us to use some proper scripting language.

If you're worried that `$0` won't point at the right file, just wrap it with some `readlink -f` 🤷‍♀️.
