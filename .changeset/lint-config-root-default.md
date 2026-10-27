---
'@drizztdourden08/brock-lint-config': patch
---

`brockEslint` no longer depends on the folder ESLint runs from. When `rootDir` is not passed, it is now the folder of the eslint.config file that called the factory, else the nearest folder at or above the current one that holds an eslint.config file, else the current folder. Before, running ESLint from a subfolder (`apps/web` under a root config) listed the data and verbatim files relative to that subfolder, so their globs did not match and `@kind verbatim` files were not recognised. A `rootDir` you pass still wins.
