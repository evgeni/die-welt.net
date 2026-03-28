<!--
.. title: Converting Dovecot password schemes on the fly without (too much) cursing
.. slug: converting-dovecot-password-schemes-on-the-fly-without-too-much-cursing
.. date: 2026-03-28 22:11:57 UTC
.. tags: english,linux,planet-debian,software
.. category: 
.. link: 
.. description: 
.. type: text
-->

I finally upgraded my mail server to Debian 13 and, as expected, the Dovecot part was quite a ride.

The configuration syntax changed between Dovecot 2.3 (Debian 12) and Dovecot 2.4 (Debian 13),
so I started first with diffing my configuration against a vanilla Debian 12 one (this setup is slightly old) and then applied the same (logical) changes to a vanilla Debian 13 one.
This mostly went well.
Mostly because my user database is stored in SQL and while the [Dovecot Configuration Upgrader](https://dovecot.org/upgrader/) says it can convert old `dovecot-auth-sql.conf.ext` files to the new syntax,
it only does so for the structure, not the SQL queries themselves.
While I don't expect it to be able to parse the queries and adopt them correctly,
at least a hint that the field names in [userdb](https://doc.dovecot.org/2.4.3/core/config/auth/userdb.html) changed and might require adjustment would've been cool.

Once I got that all sorted, Dovecot would still refuse to let me in:
```text
Error: sql: Invalid password in passdb: Weak password scheme 'MD5-CRYPT' used and refused
```

Yeah, right.
Did I mention that this setup is old?

The quick cure against this is a `auth_allow_weak_schemes = yes` in `/etc/dovecot/conf.d/10-auth.conf`,
but long term I really should upgrade the password hashes in the database to something more modern.

And this is what this post is about.

My database only contains hashed (and salted) passwords,
so I can't just update them without changing the password.
And while there are only 9 users in total,
I wanted to play nice and professional.
(LOL)

There is a [Converting Password Schemes](https://doc.dovecot.org/2.4.3/howto/convert_password_schemes.html) howto in the Dovecot documentation,
but it uses a rather odd looking PHP script, wrapped in a shell script which leaks the plaintext password to the process list,
and I really didn't want to remember how to write PHP to complete this task.

Luckily, [I know Python](https://xkcd.com/208/).

The general idea is:
* As we're using plaintext authentication (`auth_mechanisms = plain login`),
  the plaintext password is available during login.
* After Dovecot's `imap-login` has verified the password against the old (insecure) hash in the database,
  we can [execute a post-login script](https://doc.dovecot.org/2.4.3/core/config/post_login_scripting.html),
  which will connect to the database and update it with a new hash of the plaintext password.

To make the plaintext password available to the post-login script,
we add `'%{password}' as userdb_plain_pass` to the `SELECT` statement of our `passdb` query.
The original howto also says to add a `prefetch` `userdb`, which we do.
The `sql` `userdb` remains, as otherwise Postfix can't use Dovecot to deliver mail.

Now comes the interesting part.
We need to write a script that is executed by Dovecot's `script-login` and that will update the database for us.
Thanks to Python's [`passlib`](https://passlib.readthedocs.io/) and [`mysqlclient`](https://github.com/PyMySQL/mysqlclient),
the database and hashing parts are relatively straight forward:

```python
#!/usr/bin/env python3

import os

import MySQLdb
import passlib.hash

DB_SETTINGS = {"host": "127.0.0.1", "user": "user", "password": "password", "database": "mail"}
SELECT_QUERY = "SELECT password_enc FROM mail_users WHERE username=%(username)s"
UPDATE_QUERY = "UPDATE mail_users SET password_enc=%(pwhash)s WHERE username=%(username)s"

SCHEME = "bcrypt"
EXPECTED_PREFIX = "$2b$"


def main():
    # https://doc.dovecot.org/2.4.3/core/config/post_login_scripting.html
    # https://doc.dovecot.org/2.4.3/howto/convert_password_schemes.html
    user = os.environ.get("USER")

    plain_pass = os.environ.get("PLAIN_PASS")
    if plain_pass is not None:
        db = MySQLdb.connect(**DB_SETTINGS)
        cursor = db.cursor()
        cursor.execute(SELECT_QUERY, {"username": user})
        result = cursor.fetchone()
        current_pwhash = result[0]

        if not current_pwhash.startswith(EXPECTED_PREFIX):
            hash_module = getattr(passlib.hash, SCHEME)
            pwhash = hash_module.hash(plain_pass)
            data = {"pwhash": pwhash, "username": user}
            cursor.execute(UPDATE_QUERY, data)
        cursor.close()
        db.close()


if __name__ == "__main__":
    main()
```

But if we add that as `executable = script-login /etc/dovecot/dpsu.py` to our `imap-postlogin` `service`,
as the howto suggests, the users won't be able to login anymore:
```text
Error: Post-login script denied access to user
```

WAT?

Remember that shell script I wanted to avoid?
It ends with `exec "$@"`.

Turns out the `script-login` "API" is rather interesting.
It's not "pass in a list of scripts to call and I'll call all of them".
It's "pass a list of scripts, I'll [`execv`](https://linux.die.net/man/3/execv) the first item and pass the rest as args, and every item is expected to `execv` the next one again". 🤯

With that (cursed) knowledge, the script becomes:
```python
#!/usr/bin/env python3

import os
import sys

import MySQLdb
import passlib.hash

DB_SETTINGS = {"host": "127.0.0.1", "user": "user", "password": "password", "database": "mail"}
SELECT_QUERY = "SELECT password_enc FROM mail_users WHERE username=%(username)s"
UPDATE_QUERY = "UPDATE mail_users SET password_enc=%(pwhash)s WHERE username=%(username)s"

SCHEME = "bcrypt"
EXPECTED_PREFIX = "$2b$"


def main():
    # https://doc.dovecot.org/2.4.3/core/config/post_login_scripting.html
    # https://doc.dovecot.org/2.4.3/howto/convert_password_schemes.html
    user = os.environ.get("USER")

    plain_pass = os.environ.get("PLAIN_PASS")
    if plain_pass is not None:
        db = MySQLdb.connect(**DB_SETTINGS)
        cursor = db.cursor()
        cursor.execute(SELECT_QUERY, {"username": user})
        result = cursor.fetchone()
        current_pwhash = result[0]

        if not current_pwhash.startswith(EXPECTED_PREFIX):
            hash_module = getattr(passlib.hash, SCHEME)
            pwhash = hash_module.hash(plain_pass)
            data = {"pwhash": pwhash, "username": user}
            cursor.execute(UPDATE_QUERY, data)
        cursor.close()
        db.close()

    os.execv(sys.argv[1], sys.argv[1:])


if __name__ == "__main__":
    main()
```

And the passwords are getting gradually updated as the users log in.
Once all are updated, we can remove the post-login script and drop the `auth_allow_weak_schemes = yes`.
