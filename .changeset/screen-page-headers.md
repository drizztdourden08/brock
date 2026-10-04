---
'@drizztdourden08/brock-build': minor
'@drizztdourden08/brock-react': minor
'@drizztdourden08/brock-input': minor
---

Every screen shows Tessera's page header with an icon and a title.

- Breaking: `ScreenDef.icon`, `HubDef.icon` and `HubPage.icon` are required, and `ScreenLayer` takes a required `icon`. Every built-in screen has one: Profiles, Settings, About, Credits and the input tester.
- A fullscreen screen's content sits in Tessera's `ScreenPage` inside the `ScreenLayer` card, with the screen icon and title. `header: 'own'` leaves the content to draw its own headers; hubs and the settings screen use it. Each hub page draws under its own header: settings pages in `SettingsPage` with their anchors, a settings tab that renders itself in `SettingsPage` too, and every other page in `ScreenPage`. `HubPage.fullBleed` keeps a page such as a bucket's hero home filling the pane.
- The About screen passes the app name as the `InfoScreen` heading and an info icon.
- The `screen-icons` migration (0.10.0) leaves a to-do on each `defineScreen` or `defineHub` call without an icon.
- The review checks the page header, its icon and its title on every screen and every hub page that has one.
