<!--
.. title: Validating cloud-init configs without being root
.. slug: validating-cloud-init-configs-without-being-root
.. date: 2026-01-21 19:42:45 UTC
.. tags: english,linux,planet-debian,software,foreman
.. category:
.. link:
.. description:
.. type: text
-->

Somehow this whole DevOps thing is all about generating the wildest things from some (usually equally wild) template.

And today we're gonna generate [YAML from ERB](https://github.com/theforeman/foreman/blob/develop/app/views/unattended/provisioning_templates/cloud_init/cloud_init_default.erb), what could possibly go wrong?!

Well, actually, [quite](https://projects.theforeman.org/issues/38442) [a lot](https://projects.theforeman.org/issues/37433),
so one wants to validate the generated result before using it to break systems at scale.

The YAML we generate is a cloud-init [cloud-config](https://cloudinit.readthedocs.io/en/latest/explanation/about-cloud-config.html),
and while checking that we generated a valid YAML document is easy (and we were already doing that),
it would be much better if we could check that cloud-init can actually use it.

Enter [`cloud-init schema`](https://cloudinit.readthedocs.io/en/latest/howto/debug_user_data.html#check-user-data-cloud-config), or so I thought.
Turns out [running `cloud-init schema` is rather broken without root privileges](https://github.com/canonical/cloud-init/issues/6680),
as it tries to load [a ton of information from the running system](https://github.com/canonical/cloud-init/issues/6592).
This seems like a bug (or multiple), as the data should not be required for the validation of the schema itself.
I've not found a way to disable that behavior.

Luckily, [I know Python](https://xkcd.com/208/).

Enter `evgeni-knows-better-and-can-write-python`:

```python
#!/usr/bin/env python3

import sys
from cloudinit.config.schema import get_schema, validate_cloudconfig_file, SchemaValidationError

try:
    valid = validate_cloudconfig_file(config_path=sys.argv[1], schema=get_schema())
    if not valid:
        raise RuntimeError("Schema is not valid")
except (SchemaValidationError, RuntimeError) as e:
    print(e)
    sys.exit(1)
```

The canonical[^canonical] version if this [lives in the Foreman git repo](https://github.com/theforeman/foreman/blob/develop/script/cloud-init-validate), so go there if you think this will ever receive any updates.

The hardest part was to understand the`validate_cloudconfig_file` API,
as it will sometimes raise an `SchemaValidationError`,
sometimes a `RuntimeError` and sometimes just return `False`.
No idea why.
But the above just turns it into a couple of printed lines and a non zero exit code,
unless of course there are no problems, then you get peaceful silence.

[^canonical]: ["canonical"](https://en.wikipedia.org/wiki/Canonical), not ["Canonical"](https://en.wikipedia.org/wiki/Canonical_(company))
