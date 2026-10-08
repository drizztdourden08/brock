<!-- @layer docs @kind doc -->
# brock-lint-config

Brock's app preset on top of [`@drizztdourden08/standards`](https://github.com/drizztdourden08/standards). The rules, the factories and the word lists live in standards; this package keeps the names Brock apps import, so an app config does not change.

## Use

```js
// eslint.config.mjs
import { brockEslint } from '@drizztdourden08/brock-lint-config';
export default brockEslint({ presets: ['react-app'], primitivesGlobs: ['src/ui/primitives/**/*.tsx'], allow: ['enhanced'] });

// stylelint.config.mjs
import { brockStylelint } from '@drizztdourden08/brock-lint-config/stylelint';
export default brockStylelint({ uiGlobs: ['src/**/*.css'], tokenGlobs: ['src/theme/**/*.css'] });

// .markdownlint-cli2.mjs
import { brockMarkdownlint } from '@drizztdourden08/brock-lint-config/markdownlint';
export default brockMarkdownlint({ ignores: ['vendor/**'] });
```

```json
{ "extends": "@drizztdourden08/brock-lint-config/tsconfig/react.json", "include": ["src"] }
```

## What it adds to standards

`brockEslint` is `standardsEslint` with the `react-app` preset and Brock's extension, `standards.extension.mjs`, which the package also declares in its `package.json`, so installing it is enough:

| Facet | Adds |
|---|---|
| ESLint | raw-control messages that name the Tessera components (`TextInput`, `Select`, `TextArea`), default exports for screen files, widget files (`src/widgets/**/<id>.widget.tsx`) and the widget layout (`src/widgets/layout.ts`), module entries, `brock.workspace.mjs` and `boot/*.task.ts`, and screen and widget files as lists for `local/one-export-per-file` |
| ESLint | `brock/data-only`, and the `@kind data` file kind below |
| stylelint | `@drizztdourden08/tessera/tokens.css` as a token source for `brock/no-token-override` and `brock/no-token-shadow` |

## The data file kind

A record file or a generated table declares `@kind data` in its header (`/* @layer shared-game @kind data */`). `brockEslint` lists those files when it loads (from `git ls-files` under `rootDir`, else the current folder, or a walk outside git) and turns three rules off for them: `max-lines`, `local/one-export-per-file` and `local/constants-in-constants-file`. `brock/data-only` runs on every source file and, in a file with that header, fails on anything that is not data: a top-level statement other than an import, a type, an export list or a `const`, and inside a `const` anything other than literals, template literals, arrays, objects (no methods, getters or setters), spreads, references, unary and arithmetic or bitwise operators, `as`, `satisfies` and `Object.freeze`. So the exemptions cover data alone, and a file cannot claim the kind to dodge the rules. An editor picks a newly marked file up when its ESLint server restarts.

The kind is decided here and not in standards because standards decides file kinds from the path (`fileKinds`), and a core rule such as `max-lines` cannot read the header. Moving it into standards means a header-aware `kindsOf` there, which `local/one-export-per-file` and `local/constants-in-constants-file` would then read, and a `files` block like this one for `max-lines`.

Every option of the standards factories works here. The rules, their ids (`local/*`, `BROCK001` to `BROCK006`, `brock/no-token-*`) and the extension API are documented in the standards README; the structure guide is its `docs/structure.md`.
