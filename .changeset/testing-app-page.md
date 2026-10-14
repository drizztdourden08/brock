---
'@drizztdourden08/brock-build': minor
---

`@drizztdourden08/brock-build/testing` exports `waitForAppPage(app, timeoutMs?)` and `pageKindOf(url)`, so a test that launches the app itself waits for the app window instead of taking the splash from `firstWindow()`. `launchAppForTest` takes `userData`, the app's own profile folder with the test's fixtures, which `close()` leaves in place.
