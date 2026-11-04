---
'@drizztdourden08/brock-lint-config': patch
---

The Brock stylelint preset skips the generated `.brock/` folder, as the ESLint preset already does. `brock sync` writes `.brock/palette.css` with a plain header, which `comment-pattern` flagged once standards 0.14.9 linted every git-listed style file.
