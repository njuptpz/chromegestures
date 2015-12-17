This is a compendium of common questions we receive in the Chrome Gestures thread on [Chrome Plugins](http://www.chromeplugins.org/google/).

**I can't install your extension! What do I do?**<br />
First make sure you're on the [Developer Channel](http://dev.chromium.org/getting-involved/dev-channel") of Google Chrome. Second you'll have to make Chrome open with extensions enabled. The easiest way of doing this is by using [this](http://www.chromeplugins.org/google/chrome-tools/add-management-7861.html) and select Run Chrome with Extensions and User Scripts by default.

**I don't want to use the Developer Channel but I still want to use your extension. Can I?**<br />
Stable and Beta channel are able to use User Scripts, so you can use our User Script release instead. This will always be more limited than the extension version so we recommend you upgrade to the developer's channel and use extensions instead.

**How do I use my gesture? I'm moving my mouse and stuff but nothing is happening..**<br />
You must hold right-click while performing a gesture, and release it to active that gesture.

**Can I turn the arrows off?**<br />
Not yet. We will add that option in the next version.

**Closing the tab doesn't work in gmail or (other site), why not?**<br />
This probably has to do with that page blocking the window.close() function, or hooking a related event or something to prevent it form closing so easily. We'll hopefully fix this when we put more effort into figuring out why it's not working.

**I'm looking at the help file and gestures like reload and such are so square.. it seems difficult to make.**<br />
Even though it looks like a corner, you can make the gesture as a curve as well. Reload is simply a clockwise, circular motion that starts and ends at the top of the circle.

**How do I add my own gesture?**<br />
First and foremost, you _must_ know `JavaScript` to add the action for the gesture. If you do not, you can ask someone for help in writing the action. See the [Gestures tutorial](GesturesTutorial.md) for more info.

**How do I `JavaScript`?**<br />
[Google it.](http://www.google.com/search?q=javascript+beginner+tutorial)

**My options aren't working!! Is this a bug?**<br />
No not really. We're limited on how we can load information right now, and how we have to do it is by creating and communicating with a pop-up. Some people don't like this, because they get a pop-up blocked notification, so loading options automatically has been disabled by default. If you would like your options to be loaded, open **`ChromeGestures.user.js`** and change
```
var popupLoader = false;
```
To
```
var popupLoader = true;
```

**Okay I enabled loading, but it's blocking the popup..are my options still being loaded?**<br />
Yes they are. If you'd like to make sure, use the gesture `[`left, click, right`]` to alert the current value of your mouse sensitivity.