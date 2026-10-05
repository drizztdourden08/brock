---
'@drizztdourden08/brock-react': minor
'@drizztdourden08/brock-build': minor
---

Brock moves to Tessera 0.20.0: the workspace catalog and brock-react's peer range are `^0.20.0` (MIGRATION §170 to §180). `brock upgrade` from 0.22.0 replays RENAMES.json (ChosenMascot to AnimatedMascot, PathField to PathInput, the removed parts, the eighteen Glyph names, StatRow `copyable`, CommandPalette `sentri` to `rotp`), and two 0.23.0 migrations cover what it does not:

- `tessera-tier-moves` moves imports of the parts that changed entry point: Splash, Toast, ToastContainer, ShortcutList, CodeBlock, Video, RetryButton, CommandInput, PasswordInput, TagInput and PathField (with their types) from `/primitives` to `/composites`, Overlay to `/primitives` and PixelWordmark to `/brand`. RENAMES.json names no entry point, so an import that only got renamed would point at the wrong one. The root import is left alone.
- `menu-confirm-store` lists each use of the removed `useMenuConfirmStore`, `MenuConfirmState` and `MenuResolver.armed` as a to-do.

The replay no longer flags every import of `Text` for the removed `Text.CodeBlock`: a removed member is a to-do only on the lines that use it.
