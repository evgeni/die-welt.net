<html><body><p>Some time ago, the <a title="QR Code Generator - WiFi Access" href="http://blog.qr4.nl/QR-Code-WiFi.aspx">QR Code Generator - WiFi Access</a> made quite some noise on the mighty Internet. Sure, it is cool to be able to share your WiFi-access with someone by just showing him a QR code he can scan on his phone and the phone will auto-connect to the WiFi. But I get a strange feeling telling someone I do not know my WiFi credentials. No, I do not mean my guests, I know them. I mean that shiny web-service that will generate a QR code for me.



The geek in you will now say: "So? Open up a terminal, install <code>qrencode</code>, pipe it the string <code>WIFI:S:&lt;SSID&gt;;T:&lt;WPA|WEP|&gt;;P:&lt;password&gt;;;</code> and you got our QR code". Yeah, that works. But was it one or two semicolons at the end? And was it really just WPA even if my WiFi uses WPA2? Oh and how do I encode that umlaut again? <strong>I</strong> do not want to remember this.



Thus, without too much rumble, may I present you: <a href="https://qifi.org">QiFi - the pure JS WiFi QR Code Generator</a>. QiFi is a QR code generator for WiFi access in pure JavaScript. It will generate the QR code on <strong>your</strong> machine, in <strong>your</strong> browser, not leaking your precious credentials to anyone (but your guests). Don't trust me? <a href="https://github.com/evgeni/qifi">Read the code</a>. Fork the code. Host the code yourself.



I hope you will find QiFi at least slightly useful ;-)</p></body></html>