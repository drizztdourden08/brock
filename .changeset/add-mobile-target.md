---
'@drizztdourden08/brock-build': minor
---

`brock add mobile` now wires Capacitor into an app. Mobile is a target, not a module, so the command runs the android platform steps, the same as `brock platform add mobile`, and installs no package. After it succeeds it prints the next steps: `<app> mobile build` for the APK and `<app> mobile keystore` for the release keystore. The `--local` flag does not apply and is ignored with a note.
