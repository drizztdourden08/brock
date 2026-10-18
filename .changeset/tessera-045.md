---
'@drizztdourden08/brock-react': minor
---

Brock moves to Tessera 0.45.0, which brings one pane edge everywhere. SidePanel and ListDetailLayout lose `resizable`, ResizeHandle's look, `onCollapse`, children and `onClick` give way to `fold`, and SplitPane's `snapAt` becomes `collapsible`. Brock used none of them. Apps that did follow Tessera's MIGRATION 269, and upgrade with `brock migrate`.
