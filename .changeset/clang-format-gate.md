---
'@drizztdourden08/brock-build': minor
---

`gate.clangFormat` in `brock.config.ts` names folders or files of C sources, relative to the repo root. While it names any, `brock sync` writes a managed `.clang-format` at that root, in the style of Relic of the Past's `core/game-hooks` (two-space indent, attached braces, short ifs, loops, cases and functions on one line, `int *p`, binary operators leading a broken line, trailing comments and includes left as they are, no column limit), and `brock gate` checks every `.c` and `.h` file under them with `clang-format --dry-run --Werror`, listing the files that differ. `brock clang-format` rewrites them. clang-format 16 or later comes from `BROCK_CLANG_FORMAT`, the app's or repo's `node_modules/.bin`, the `PATH`, then the Visual Studio C++ tools.
