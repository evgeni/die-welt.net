<!--
.. title: A String is not a String, and that's Groovy!
.. slug: a-string-is-not-a-string-and-thats-groovy
.. date: 2021-11-19 14:16:00 UTC
.. tags: english,planet-debian,software,linux,foreman
.. category: 
.. link: 
.. description: 
.. type: text
-->

Halloween is over, but I still have some nightmares to share with you, so sit down, take some hot chocolate and enjoy :)

When working with Jenkins, there is almost no way to avoid writing Groovy. Well, unless you only do old style jobs with shell scripts, but y'all know what I think about shell scripts…

Anyways, [Eric](https://github.com/ehelms) have been rewriting the jobs responsible for building Debian packages for [Foreman](https://theforeman.org) to pipelines (and thus Groovy).

Our build process for pull requests is rather simple:

1. Setup sources - get the orig tarball and adjust changelog to have an unique version for pull requests
2. Call pbuilder
3. Upload the built package to a staging archive for testing

For merges, it's identical, minus the changelog adjustment.

And if there are multiple packages changed in one go, it runs each step in parallel for each package.

Now I've been doing mass changes to our plugin packages, to move them to a shared postinst helper instead of having the same code over and over in every package. This required changes to many packages and sometimes I'd end up building multiple at once. That should be fine, right?

Well, yeah, it did *build* fine, but the *upload* only happened for the last package. This felt super weird, especially as I was absolutely sure we did test this scenario (multiple packages in one PR) and it worked just fine…

So I went on a ride though the internals of the job, trying to understand why it didn't work.

This requires a tad more information about the way we handle packages for Foreman:

* the archive is handled by [freight](https://github.com/freight-team/freight)
* it has suites like `buster`, `focal` and `plugins` (that one is a tad special)
* each suite has components that match Foreman releases, so `2.5`, `3.0`, `3.1`, `nightly` etc
* core packages (Foreman etc) are built for all supported distributions (right now: buster and focal)
* plugin packages are built only once and can be used on every distribution

As generating the package index isn't exactly fast in freight, we tried not not run it too often. The idea was that when we build two packages for the same target (suite/version combination), we upload both at once and run import only once for both. That means that when we build Foreman for buster and focal, this results in two parallel builds and then two parallel uploads (as they end up in different suites). But if we build Foreman and Foreman Installer, we have four parallel builds, but only two parallel uploads, as we can batch upload Foreman and Installer per suite. Well, or so was the theory.

The Groovy code, that was supposed to do this looked roughly like this:

```groovy
def packages_to_build = find_changed_packages()
def repos = [:]

packages_to_build.each { pkg ->
    suite = 'buster'
    component = '3.0'
    target = "${suite}-${component}"

    if (!repos.containsKey(target)) {
        repos[target] = []
    }

    repos[target].add(pkg)
}

do_the_build(packages_to_build)
do_the_upload(repos)
```

That's pretty straight forward, no? We create an empty [Map](https://docs.groovy-lang.org/latest/html/groovy-jdk/java/util/Map.html), loop over a list of packages and add them to an entry in the map which we pre-create as empty if it doesn't exist.

Well, no, the resulting map always ended with only having one element in each target list. And this is also why our original tests always worked: we tested with a PR containing changes to Foreman and a plugin, and plugins go to this special target we have…

So I started playing with the code ([https://groovyide.com/playground](https://groovyide.com/playground) is really great for that!), trying to understand why the heck it erases previous data.

The first finding was that it just always ended up jumping into the "if map entry not found" branch, even though the map very clearly had the correct entry *after* the first package was added.

The second one was weird. I was trying to minimize the reproducer code (IMHO always a good idea) and switched `target = "${suite}-${component}"` to `target = "lol"`. Two entries in the list, only one jump into the "map entry not found" branch. What?! 🧐

So this is clearly related to the fact that we're using String interpolation here. But hey, that's a totally normal thing to do, isn't it?!

Admittedly, at this point, I was lost. I knew *what* breaks, but not *why*.

Luckily, I knew exactly who to ask: [Jens](https://twitter.com/jbendisposto).

After a brief "well, that's interesting", Jens quickly found the source of our griefs: [Double-quoted strings are plain `java.lang.String` if there’s no interpolated expression, but are `groovy.lang.GString` instances if interpolation is present.](https://groovy-lang.org/syntax.html#_double_quoted_string). And when we do `repos[target]` the GString `target` gets converted to a String, but when we use `repos.containsKey()` it remains a GString. This is because [GStrings get converted to Strings, if the method wants one](https://groovy-lang.org/syntax.html#_interoperability_with_java), but [`containsKey`](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/Map.html#containsKey(java.lang.Object)) takes any `Object` while the `repos[target]` notation for some reason converts it. Maybe this is because [using GString as Map keys should be avoided](https://groovy-lang.org/syntax.html#_gstring_and_string_hashcodes).

We can reproduce this with simpler code:
```groovy
def map = [:]
def something = "something"
def key = "${something}"
map[key] = 1
println key.getClass()
map.keySet().each {println it.getClass() }
map.keySet().each {println it.equals(key)}
map.keySet().each {println it.equals(key as String)}
```

Which results in the following output:
```
class org.codehaus.groovy.runtime.GStringImpl
class java.lang.String
false
true
```

With that knowledge, the fix was to just use the same `repos[target]` notation also for checking for existence — Groovy helpfully returns `null` which is false-y when it can't find an entry in a Map absent.

So yeah, a String is not always a String, and it'll bite you!
