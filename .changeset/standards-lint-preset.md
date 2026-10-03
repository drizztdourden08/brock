---
'@drizztdourden08/brock-lint-config': minor
---

The rules move to `@drizztdourden08/standards`, and `brock-lint-config` becomes Brock's app preset on top of it, with the same exports: `brockEslint`, `brockStylelint`, `brockMarkdownlint`, the rule sets, `./slop-patterns`, `./slop-line-kind`, `./markdown-rules`, `./file-shape`, `./stylelint-rules/*` and `./tsconfig/*`, so app configs do not change. `brockEslint` is `standardsEslint` with the `react-app` preset and Brock's extension (Tessera names in the raw-control messages, default exports for screens, module entries and boot tasks, Tessera's tokens for `brock/no-token-*`), which the package also declares in `package.json` for discovery. Every source file now needs the `/* @layer <layer> @kind <kind> */` header (`local/file-header`). `typescript-eslint`, `eslint-plugin-react-hooks` and `stylelint-config-standard` are no longer peers: standards carries them.
