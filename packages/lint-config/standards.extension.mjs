/* @layer tooling-scripts @kind config */
import { defineExtension } from '@drizztdourden08/standards';

const SCREEN_FILE_GLOBS = ['**/src/screens/**/*.{hero,page,tab,card,custom,layer}.tsx', '**/src/screens/**/*.{settings,page}.ts'];
const SCREEN_FILE = '(^|\\/)src\\/screens\\/.+\\.(?:(?:hero|page|tab|card|custom|layer)\\.tsx|(?:settings|page)\\.ts)$';
const WIDGET_FILE_GLOBS = ['**/src/widgets/**/*.widget.tsx', '**/src/widgets/layout.ts'];
const WIDGET_FILE = '(^|\\/)src\\/widgets\\/(?:.+\\/)?[a-z][a-z0-9-]*\\.widget\\.tsx$';

const RAW_CONTROLS = [
  { selector: "JSXOpeningElement[name.name='input']", message: 'No raw <input> outside primitives. Use TextInput / NumberInput / Checkbox / RangeInput.' },
  { selector: "JSXOpeningElement[name.name='select']", message: 'No raw <select> outside primitives. Use Select / NativeSelect.' },
  { selector: "JSXOpeningElement[name.name='textarea']", message: 'No raw <textarea> outside primitives. Use TextArea.' },
];

const BROCK_DEFAULT_EXPORTS = [...SCREEN_FILE_GLOBS, ...WIDGET_FILE_GLOBS, '**/modules/*/src/{main,preload,renderer}/index.ts', '**/brock.workspace.mjs', '**/boot/*.task.ts'];

export default defineExtension({
  id: 'brock-lint-config',
  description: 'Brock apps: Tessera names in the raw-control messages, screen and widget files, module entries and boot tasks, Tessera tokens',
  eslint: {
    options: {
      rawControls: RAW_CONTROLS,
      defaultExportGlobs: BROCK_DEFAULT_EXPORTS,
      fileKinds: { screen: SCREEN_FILE, widget: WIDGET_FILE },
      oneExportExempt: ['screen', 'widget'],
    },
  },
  stylelint: { options: { tokens: ['@drizztdourden08/tessera/tokens.css'] } },
});
