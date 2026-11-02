---
'@drizztdourden08/brock-thread': patch
---

`brock release` starts `gh` only through the guarded wrapper, so every `gh` call it makes refuses in local mode by itself, not only through the check at the start of the verb. A test now fails if any source file outside the wrapper starts `gh`. The replay verbs are the one exception: they run only in remote mode and with `--go`.
