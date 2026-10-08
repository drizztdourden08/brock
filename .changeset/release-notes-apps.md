---
'@drizztdourden08/brock-build': minor
'@drizztdourden08/create-brock': minor
---

Brock apps release with their note. The managed `release.yml` makes the GitHub release body the note without its comment lines plus a Downloads list, names the release after the note's title, and `brock package` hands Velopack the same note (`release/release-notes.md`), so `NotesMarkdown` carries it to the updater. A new app ships `release-notes/v0.1.0.md`, filled in with its name. The `release-notes-folder` migration (0.36.0) adds `release-notes/` with a README on the format at the repo root of an existing app, once, and leaves a to-do to write the next note.
