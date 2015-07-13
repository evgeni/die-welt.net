<html><body><p>So you probably heard that I have that little new project of mine: <a href="https://qifi.org">QiFi the pure JavaScript WiFi QR Code Generator</a>. It's been running pretty well and people even seem to like it.



One of its (unannounced) features is a pretty clean stylesheet that is used for printing. When you print the result will be just the SSID and the QR code, so you can put that piece of paper everywhere you like. That works (I tested!) fine on Iceweasel/Firefox 10.0.12 and Chromium 25.0. Today I tried to do the same in Opera 12.14 and it failed terribly: the SSID was there, the QR code not. And here my journey begins...



First I suspected the CSS I used was fishy, so I kicked all the CSS involved and retried: still no QR code in the print-out.



So maybe it's the QR code library I use that produces a weird canvas? Nope, the examples on <a href="http://diveintohtml5.info/canvas.html">http://diveintohtml5.info/canvas.html</a> and <a href="http://devfiles.myopera.com/articles/649/example5.html">http://devfiles.myopera.com/articles/649/example5.html</a> don't print either.



Uhm, let's Google for “opera canvas print”... And oh boy I should not have done that. It seems it's <a href="http://stackoverflow.com/questions/5217377/print-out-of-a-html5-canvas">a bug</a> <a href="http://stackoverflow.com/questions/8031016/printing-the-contents-of-the-canvas-tag">in Opera</a>. And the proposed solution is to use <code>canvas.toDataURL()</code> to render the canvas as an image and load the image instead of the canvas.



I almost went that way. But I felt that urge need to read the docs before. So I opened <a href="http://www.w3.org/html/wg/drafts/html/master/embedded-content-0.html#dom-canvas-todataurl">http://www.w3.org/html/wg/drafts/html/master/embedded-content-0.html#dom-canvas-todataurl</a> and <a href="https://developer.mozilla.org/en-US/docs/DOM/HTMLCanvasElement">https://developer.mozilla.org/en-US/docs/DOM/HTMLCanvasElement</a> and started puking:

</p><blockquote>When trying to use types other than "<code>image/png</code>", authors can check if the image was really returned in the requested format by checking to see if the returned string starts with one of the exact strings "<code title="">data:image/png,</code>" or "<code title="">data:image/png;</code>". If it does, the image is PNG, and thus the requested type was not supported. (The one exception to this is if the canvas has either no height or no width, in which case the result might simply be "<code title="">data:,</code>".)</blockquote>

<blockquote>If the type requested is not image/png, and the returned value starts with data:image/png, then the requested type is not supported.</blockquote>

Really? I have to check the returned <strong>STRING</strong> to know if there was an error? Go home HTML5, you're drunk!



Okay, okay. No canvas rendered to images then. Let's just render the QR code as a <code>&lt;table&gt;</code> instead of a <code>&lt;canvas&gt;</code> when the browser looks like Opera. There is nothing one could do wrong with tables, right? But let's test with the <a href="http://jeromeetienne.github.com/jquery-qrcode/examples/basic.html">basic example</a> first:<a href="/wp-content/uploads/2013/03/opera-qrcode.png"><img class="aligncenter size-medium wp-image-1123" title="opera-qrcode" src="/wp-content/uploads/2013/03/opera-qrcode-132x300.png" alt="" width="132" height="300"></a>



Yes, this is 2013. Yes, this is Opera 12.14. Yes, the rendering of a fucking HTML table is wrong. Needles to say, Iceweasel and Chromium render the example just fine. I bet even a recent Internet Explorer would...



That said, there is no <del>bugfix</del>workaround for Opera I want to implement. If you use Opera, I feel sorry for you. But that's all.



Update: before someone cries "ZOMG! BUG PLZ!!!", I filled this as DSK-383716 at Opera.</body></html>