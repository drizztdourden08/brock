---
"@drizztdourden08/brock-build": patch
"@drizztdourden08/brock-updater": patch
"@drizztdourden08/brock-react": patch
"@drizztdourden08/brock-core": patch
"@drizztdourden08/brock-thread": patch
"@drizztdourden08/create-brock": patch
---

Apps update and ship the way Relic of the Past does. The update dialog no longer opens by itself: a found update shows as a badge on a version tag in the title bar, which modules reach through the new `RendererModule.titleBar` slot. `brock package` builds the app tree, the Windows installer with the app icon and a splash, and the Velopack update packages. `create-brock` and `brock adopt` write a release workflow that packages every platform and publishes to GitHub Releases with `release-notes/v<version>.md` as the body, and `brock release` dispatches it.
