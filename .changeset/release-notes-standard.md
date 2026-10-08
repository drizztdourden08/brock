---
'@drizztdourden08/brock-thread': minor
---

The release note standard reaches Brock: every release has `release-notes/v<version>.md` at the repo root, with a `# <Product> v<version>` title, a one-paragraph summary, `##` sections from a fixed list and plain-English bullets (`docs/release-notes.md` in `@drizztdourden08/standards` holds the rules; `docs/architecture.md` and `docs/app-structure.md` describe them for apps). `brock-thread` exports `checkReleaseNote(text, { version, product?, sections?, words? })` and `checkNoteFile({ rootDir, version, product?, sections? })`, a copy of the standards checker until Brock depends on standards 0.8.0, and `brock release` refuses a note that does not pass before it dispatches.
