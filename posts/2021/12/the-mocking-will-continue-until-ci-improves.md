<!--
.. title: The Mocking will continue, until CI improves
.. slug: the-mocking-will-continue-until-ci-improves
.. date: 2021-12-07 19:39:41 UTC
.. tags: english,planet-debian,software,linux,foreman
.. category: 
.. link: 
.. description: 
.. type: text
-->

One might think, this blog is exclusively about [weird](/2021/11/i-just-want-to-run-this-one-python-script/) [language behavior](/2021/11/a-string-is-not-a-string-and-thats-groovy/) and yelling at computers… Well, welcome to another episode of Jackass!

Today's opponent is [Ruby](https://www.ruby-lang.org/en/), or maybe [minitest](https://github.com/seattlerb/minitest) , or maybe [Mocha](https://github.com/freerange/mocha). I'm not exactly sure, but it was a rather amusing exercise and I like to share my nightmares ;)

It all started with the classical ["you're using old and unmaintained software, please switch to something new"](https://projects.theforeman.org/issues/26968).

The [first attempt](https://github.com/theforeman/foreman/pull/7997) was to switch from the `ci_reporter_minitest` plugin to the `minitest-ci` plugin. While the change worked great for Foreman itself, it broke the reporting in [Katello](https://github.com/Katello/Katello) - the tests would run but no `junit.xml` was generated and Jenkins rightfully complained that it got no test results.

While investigating what the hell was wrong, we realized that Katello was already using a minitest reporting plugin: `minitest-reporters`. Loading two different reporting plugins seemed like a good source for problems, so I tried [using the same plugin for Foreman too](https://github.com/theforeman/foreman/pull/8960).

Guess what? After a bit of massaging (mostly to disable the second `minitest-reporters` initialization in Katello) reporting of test results from Katello started to work like a charm. But now the Foreman tests started to fail. Not fail to report, fail to actually run. WTH‽

The failure was quite interesting too:

```
test/unit/parameter_filter_test.rb:5:in `block in <class:ParameterFilterTest>':
  Mocha methods cannot be used outside the context of a test (Mocha::NotInitializedError)
```

Yes, this is a single test file failing, all others were fine.

The failing code doesn't look problematic on first glance:

```ruby
require 'test_helper'

class ParameterFilterTest < ActiveSupport::TestCase
  let(:klass) do
    mock('Example').tap do |k|
      k.stubs(:name).returns('Example')
    end
  end
  
  test 'something' do
    something
  end
end
```

The failing line (5) is `mock('Example').tap …` and for some reason Mocha thinks it's not initialized here.

This *certainly* has something to do with *how* the various reporting plugins inject themselves, but I really didn't want to debug how to run two reporting plugins in parallel (which, as you remember, didn't expose this behavior). So the only real path forward was to debug what's happening here.

Calling the test on its own, with one of the working reporter was the first step:

```console
$ bundle exec rake test TEST=test/unit/parameter_filter_test.rb TESTOPTS=-v
…
#<Mocha::Mock:0x0000557bf1f22e30>#test_0001_permits plugin-added attribute = 0.04 s = .
#<Mocha::Mock:0x0000557bf12cf750>#test_0002_permits plugin-added attributes from blocks = 0.49 s = .
…
```

Wait, what? `#<Mocha::Mock:…>`? Shouldn't this read more like `ParameterFilterTest::…` as it happens for every single other test in our test suite? It definitely should! That's actually great, as it tells us that there is really something wrong with the *test* and the change of the reporting plugin just makes it worse.

What comes next is sheer luck. Well, that, and years of experience in yelling at computers.

We use `let(:klass)` to define an object called `klass` and this object is a `Mocha::Mock` that we'll use in our tests later. Now `klass` is a very common term in Ruby when talking about classes and needing to store them — mostly because one can't use `class` which is a keyword. Is something else in the stack using `klass` and our `let` is overriding that, making this whole thing explode?

It was! The moment we [replaced `klass` with `klass1`](https://github.com/theforeman/foreman/pull/8963) (silly, I know, but there also was a `klass2` in that code, so it did fit), things started to work nicely.

I really liked [Tomer](https://github.com/tbrisker)'s comment in the PR: ["no idea why, but I am not going to dig into mocha to figure that out."](https://github.com/theforeman/foreman/pull/8963#pullrequestreview-821333602)

Turns out, I couldn't let (HAH!) the code rest and really wanted to understand what happened there.

What I didn't want to do is to debug the whole Foreman test stack, because it is massive.

So I started to write a minimal reproducer for the issue.

All starts with a `Gemfile`, as we need a few dependencies:

```ruby
gem 'rake'
gem 'mocha'
gem 'minitest', '~> 5.1', '< 5.11'
```

Then a `Rakefile`:

```ruby
require 'rake/testtask'

Rake::TestTask.new(:test) do |t|
  t.libs << 'test'
  t.test_files = FileList["test/**/*_test.rb"]
end

task :default => :test
```

And a test! I took the liberty to replace `ActiveSupport::TestCase` with `Minitest::Test`, as the test won't be using any Rails features and I wanted to keep my environment minimal.

```ruby
require 'minitest/autorun'
require 'minitest/spec'
require 'mocha/minitest'

class ParameterFilterTest < Minitest::Test
  extend Minitest::Spec::DSL
  
  let(:klass) do
    mock('Example').tap do |k|
      k.stubs(:name).returns('Example')
    end
  end

  def test_lol
    assert klass
  end
end
```

Well, damn, this passed! Is it Rails after all that breaks stuff? Let's add it to the `Gemfile`!

```console
$ vim Gemfile
$ bundle install
$ bundle exec rake test TESTOPTS=-v
…
#<Mocha::Mock:0x0000564bbfe17e98>#test_lol = 0.00 s = .
```

Wait, I didn't change anything and it's already failing?! Fuck! I mean, cool!

But the test isn't *minimal* yet. What can we reduce? `let` is just a fancy, lazy `def`, right? So instead of `let(:klass)` we should be able to write `def class` and achieve a similar outcome *and* drop that `Minitest::Spec`.

```ruby
require 'minitest/autorun'
require 'mocha/minitest'

class ParameterFilterTest < Minitest::Test
  def klass
    mock
  end

  def test_lol
    assert klass
  end
end
```

```console
$ bundle exec rake test TESTOPTS=-v
…
/home/evgeni/Devel/minitest-wtf/test/parameter_filter_test.rb:5:in `klass': Mocha methods cannot be used outside the context of a test (Mocha::NotInitializedError)
	from /home/evgeni/Devel/minitest-wtf/vendor/bundle/ruby/3.0.0/gems/railties-6.1.4.1/lib/rails/test_unit/reporter.rb:68:in `format_line'
	from /home/evgeni/Devel/minitest-wtf/vendor/bundle/ruby/3.0.0/gems/railties-6.1.4.1/lib/rails/test_unit/reporter.rb:15:in `record'
	from /home/evgeni/Devel/minitest-wtf/vendor/bundle/ruby/3.0.0/gems/minitest-5.10.3/lib/minitest.rb:682:in `block in record'
	from /home/evgeni/Devel/minitest-wtf/vendor/bundle/ruby/3.0.0/gems/minitest-5.10.3/lib/minitest.rb:681:in `each'
	from /home/evgeni/Devel/minitest-wtf/vendor/bundle/ruby/3.0.0/gems/minitest-5.10.3/lib/minitest.rb:681:in `record'
	from /home/evgeni/Devel/minitest-wtf/vendor/bundle/ruby/3.0.0/gems/minitest-5.10.3/lib/minitest.rb:324:in `run_one_method'
	from /home/evgeni/Devel/minitest-wtf/vendor/bundle/ruby/3.0.0/gems/minitest-5.10.3/lib/minitest.rb:311:in `block (2 levels) in run'
	from /home/evgeni/Devel/minitest-wtf/vendor/bundle/ruby/3.0.0/gems/minitest-5.10.3/lib/minitest.rb:310:in `each'
	from /home/evgeni/Devel/minitest-wtf/vendor/bundle/ruby/3.0.0/gems/minitest-5.10.3/lib/minitest.rb:310:in `block in run'
	from /home/evgeni/Devel/minitest-wtf/vendor/bundle/ruby/3.0.0/gems/minitest-5.10.3/lib/minitest.rb:350:in `on_signal'
	from /home/evgeni/Devel/minitest-wtf/vendor/bundle/ruby/3.0.0/gems/minitest-5.10.3/lib/minitest.rb:337:in `with_info_handler'
	from /home/evgeni/Devel/minitest-wtf/vendor/bundle/ruby/3.0.0/gems/minitest-5.10.3/lib/minitest.rb:309:in `run'
	from /home/evgeni/Devel/minitest-wtf/vendor/bundle/ruby/3.0.0/gems/minitest-5.10.3/lib/minitest.rb:159:in `block in __run'
	from /home/evgeni/Devel/minitest-wtf/vendor/bundle/ruby/3.0.0/gems/minitest-5.10.3/lib/minitest.rb:159:in `map'
	from /home/evgeni/Devel/minitest-wtf/vendor/bundle/ruby/3.0.0/gems/minitest-5.10.3/lib/minitest.rb:159:in `__run'
	from /home/evgeni/Devel/minitest-wtf/vendor/bundle/ruby/3.0.0/gems/minitest-5.10.3/lib/minitest.rb:136:in `run'
	from /home/evgeni/Devel/minitest-wtf/vendor/bundle/ruby/3.0.0/gems/minitest-5.10.3/lib/minitest.rb:63:in `block in autorun'
rake aborted!
```

Oh nice, this is even better! Instead of the mangled class name, we now get the very same error the Foreman tests aborted with, *plus* a nice stack trace! But wait, why is it pointing at `railties`? We're not loading that! Anyways, lets look at `railties-6.1.4.1/lib/rails/test_unit/reporter.rb`, line 68

```ruby
def format_line(result)
  klass = result.respond_to?(:klass) ? result.klass : result.class
  "%s#%s = %.2f s = %s" % [klass, result.name, result.time, result.result_code]
end
```

Heh, this is touching `result.klass`, which we just messed up. Nice!

But quickly back to `railties`… What if we only add that to the `Gemfile`, not full blown Rails?

```ruby
gem 'railties'
gem 'rake'
gem 'mocha'
gem 'minitest', '~> 5.1', '< 5.11'
```

Yepp, same failure. Also happens with `require => false` added to the line, so it seems `railties` somehow injects itself into `rake` even if nothing is using it?! "Cool"!

By the way, why are we still pinning `minitest` to `< 5.11`? Oh right, this was the [*original* reason to look into that whole topic](https://projects.theforeman.org/issues/22110). And, uh, it's pointing at `klass` there already! 4 years ago!

So [lets remove that boundary](https://github.com/theforeman/foreman/pull/8969) and funny enough, *now* tests are passing again, even if we use `klass`!

Minitest 5.11 changed how `Minitest::Test` is structured, and seems not to rely on `klass` at that point anymore. And I guess Rails also changed a bit since the original pin was put in place four years ago.

I didn't want to go another rabbit hole, finding out what changed in Rails, but I did try with 5.0 (well, 5.0.7.2) to be precise, and the output with newer (>= 5.11) Minitest was interesting:

```console
$ bundle exec rake test TESTOPTS=-v
…
Minitest::Result#test_lol = 0.00 s = .
```

It's leaking `Minitest::Result` as `klass` now, instead of `Mocha::Mock`. So probably something along these lines was broken 4 years ago and triggered this pin.

What do we learn from that?

- `klass` is cursed and shouldn't be used in places where inheritance and tooling might decide to use it for some reason
- inheritance is cursed - why the heck are implementation details of Minitest leaking inside my tests?!
- tooling is cursed - why is `railties` injecting stuff when I didn't ask it to?!
- dependency pinning is cursed - at least if you pin to avoid an issue and then forget about said issue for four years
- I like cursed things!
