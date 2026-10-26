---
'@drizztdourden08/brock-build': patch
---

`brock sync --check` now checks the committed `guide.parts` file. It runs `tessera guide`, compares the file it writes with the committed one (CRLF against LF does not count), names the file when it differs and tells you to run `brock sync`, then puts the committed file back. Before, only `brock sync` and `brock build` wrote that file, so a stale one passed the check and showed up as a dirty tree after the next build.
