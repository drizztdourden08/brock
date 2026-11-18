---
'@drizztdourden08/brock-electron': minor
'@drizztdourden08/brock-build': minor
---

Main process text goes through `ctx.i18n`. Brock's own English (tray, edit menu, dialogs, boot labels, splash) lives in `brock-main.json` and shows with no locales option. `bootstrapApp` takes `locales`, and a locale change rebuilds the tray, the edit menu and the splash text.
