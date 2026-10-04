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
| stylelint | `@drizztdourden08/tessera/tokens.css` as a token source for `brock/no-token-override` and `brock/no-token-shadow` |

Every option of the standards factories works here. The rules, their ids (`local/*`, `BROCK001` to `BROCK006`, `brock/no-token-*`) and the extension API are documented in the standards README; the structure guide is its `docs/structure.md`.
