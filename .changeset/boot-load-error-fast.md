---
'@drizztdourden08/brock-electron': patch
'@drizztdourden08/brock-build': patch
---

A dev app now stops at once when the interface fails to load, for example on a module error after a Tessera mismatch. The splash shows the error with Open logs, Retry and Quit instead of waiting 120 s for the watchdog. Launch, dev, build and start also stop with one clear line when the app's Tessera does not fit what brock-react needs, and brock doctor checks the same.
