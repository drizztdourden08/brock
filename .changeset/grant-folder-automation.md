---
'@drizztdourden08/brock-electron': minor
'@drizztdourden08/brock-core': minor
---

Tests can now exercise the folder grant of `documents.open` and `documents.saveAs`. `grantFolder: { ask: true, showOnAutomation: true }` shows the native folder question on a plain `--no-focus` launch, like `ctx.dialogs.confirm({ showOnAutomation })`, and it stays refused on `--review` and `--screenshot` launches. For hidden tests that cannot click a dialog, the launch flag `--answer-folder-grants=grant|decline` answers the question without showing it. It is honoured only on an automation launch of an unpackaged app, and ignored and logged once anywhere else. It grants the same folder a human yes would, and only when the app asked with a valid `grantFolder` option. No change is needed in an existing app.
