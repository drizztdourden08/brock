---
'@drizztdourden08/brock-react': minor
---

Three APIs let an assistant read and drive the app. `settingsCatalog()` lists every settings tab with its sections and items (key, label, description, control, choices, value source, current value), and `settings.set(key, value)` writes one app setting after checking the key and the value. `nav.routes()` lists the screens, hubs, pages and tabs that `nav.open` accepts. `dialogs.current()` returns the open confirm dialog with its choices, and `dialogs.answer(choice)` answers it like a click, so a confirm left open never hangs a run.
