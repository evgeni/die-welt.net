<html><body><p>As some of you might know, I have to work with Plone quite often.<br>

Today I had to upgrade a Plone 3.0 instance to Plone 3.1 (3.1.5.1 actually). Not quite a big problem, push the new tarball in, run portal_migration and be ready... Not here, just after the upgrade, all our customized forms have stopped working (we had customized join_form and personalize_form heavily), the only error in event.log was:<br>

<br>

...<br>

  Module plone.protect.utils, line 32, in _curried<br>

  Module plone.protect.authenticator, line 60, in check<br>

Forbidden: Form authenticator is invalid.<br>

<br>

<br>

Well, for all of you who will have the same problem (and for me to remember):<br>

You have to add<br>

<strong>&lt;input tal:replace="structure context/@@authenticator/authenticator" /&gt;</strong><br>

just after<br>

<strong>&lt;input type="hidden" name="form.submitted" value="1" /&gt;</strong><br>

in your Page Template ;)<br>

<br>

So long, and have fun with this great product :)</p></body></html>