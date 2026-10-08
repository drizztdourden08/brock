---
'@drizztdourden08/brock-lint-config': minor
---

A file whose header says `@kind data` is a data file: `brockEslint` finds these files by their header and turns `max-lines`, `local/one-export-per-file` and `local/constants-in-constants-file` off for them, so a record file or a generated table can run past 200 lines, export several lists and keep its `UPPER_SNAKE` consts. The new `brock/data-only` rule holds such a file to data: imports, types, export lists and `const` declarations of literals, arrays, objects, spreads, references, constant arithmetic, `as`, `satisfies` and `Object.freeze`. A function, a call, a conditional, a getter, `let` or any other statement there is an error, so the kind cannot be claimed to dodge the rules.
