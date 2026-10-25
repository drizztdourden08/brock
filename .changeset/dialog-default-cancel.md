---
'@drizztdourden08/brock-electron': minor
---

`ctx.dialogs.confirm` takes `defaultButton: 'confirm' | 'cancel'`, the button Enter lands on (`'confirm'` by default, as before). Escape and closing the box still answer `false`. A new `ctx.dialogs.choose({ title, message, detail?, choices, defaultId, cancelId, showOnAutomation? })` shows two to four named answers and resolves the id picked. Enter picks `defaultId`. Escape, closing the box and an automation launch resolve `cancelId`. Bad ids or a wrong number of choices throw. No change is needed in an existing app.
