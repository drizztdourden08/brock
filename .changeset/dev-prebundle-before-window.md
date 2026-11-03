---
'@drizztdourden08/brock-build': patch
---

`brock dev` now pre-bundles the renderer dependencies before it starts electron-vite, so the window no longer opens blank for minutes after a lockfile change. It prints a line when the pre-bundle starts, one every 15 seconds, and the count when it ends. When the dependencies are already in place it adds only the config check, and a failed pre-bundle only warns and leaves the work to the dev server.
