---
'@drizztdourden08/brock-build': patch
'@drizztdourden08/brock-lint-config': patch
'@drizztdourden08/create-brock': patch
---

The generated `.brock` files are never linted: `brockEslint` ignores `**/.brock/**`, the templates list it, and migration `eslint-brock-ignore` adds it to the ESLint config of the app and of the workspace root.
