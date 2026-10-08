---
'@drizztdourden08/brock-build': patch
---

The managed workflows run every action on its Node 24 major: `actions/checkout@v7`, `actions/setup-node@v7`, `actions/upload-artifact@v7`, `actions/download-artifact@v8`, `actions/setup-java@v6`, `actions/setup-dotnet@v6`, `pnpm/action-setup@v6`, `android-actions/setup-android@v4` and `softprops/action-gh-release@v3`. Run `brock sync` to take them; `brock check` reports the workflows as drifted until then.
