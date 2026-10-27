---
'@drizztdourden08/brock-electron': patch
---

An app no longer piles up launch files in its user data folder. The bridge writes a `launch-bridge.data-<hash>.json` file for every `--user-data` profile it runs with, and nothing removed it when a throwaway profile was deleted. On start the bridge now removes, in the background, the launch files whose profile folder is gone, that no running instance uses and that are older than five minutes. Instance launch files and the plain `launch-bridge.json` are never touched.
