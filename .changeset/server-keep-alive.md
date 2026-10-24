---
'@drizztdourden08/brock-electron': patch
---

Keep a server process alive until it is stopped. `runServer` kept its heartbeat on an unref'd timer, so a server whose start function opens nothing that holds the event loop (the create-brock server starter, or a worker that only polls) logged `started` and then exited at once. The heartbeat timer now holds the process, and `stop()` (SIGTERM, SIGINT or an explicit call) clears it, so a stopped server exits with code 0. The new `holdProcess` option of `runServer` turns the hold off for tests that start a server and never stop it.
