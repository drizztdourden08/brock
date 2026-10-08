---
'@drizztdourden08/brock-react': minor
'@drizztdourden08/brock-updater': minor
---

`ReleaseNotesPanel` takes `markdown` and `onOpenLink`. With `markdown` on, a string note is drawn by Tessera's `Markdown` primitive when the installed Tessera exports one, and shown as text that keeps its line breaks until then, so an app moves to formatted notes with its Tessera update alone. Links go through `onOpenLink`, `openExternal` by default. The update dialog turns `markdown` on for the release note of the chosen version. `MarkdownPartProps` is exported: the props the panel passes to the part.
