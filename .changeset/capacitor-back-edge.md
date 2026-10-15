---
'@drizztdourden08/brock-react': minor
'@drizztdourden08/brock-build': minor
---

The Capacitor host reports the edge of the back gesture: `device.onBackButton` gets `left` or `right` from the `brock:back` event the Android `MainActivity` dispatches, and the app exits when nothing listens. The Android scaffold writes that activity in place of Capacitor's empty one (with `android:enableOnBackInvokedCallback` in the manifest), and leaves an activity with code of its own alone; run `platform add android` again to add it to an existing app.
