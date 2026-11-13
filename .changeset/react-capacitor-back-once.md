---
'@drizztdourden08/brock-react': patch
---

The Capacitor device port keeps one `brock:back` listener and one handler set per page, however often the platform is rebuilt. Back quits the app only when no handler is registered anywhere.
