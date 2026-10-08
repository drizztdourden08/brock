---
'@drizztdourden08/brock-react': minor
'@drizztdourden08/brock-updater': patch
---

`ReleaseNotesPanel` with `markdown` draws the note with Tessera's `Markdown` composite (Tessera 0.28): `size="sm"`, `headingOffset={2}` and `hideTitle`, so the `#` title is left out, the `##` sections are h4 under the panel title, now an h3, and lists and links keep their look. A link calls `onOpenLink`, `openExternal` by default, which opens it in the system browser; the update dialog passes `openExternal`. The run-time check for a Markdown primitive, the plain-text fallback for a markdown note and the `MarkdownPartProps` type are gone.
