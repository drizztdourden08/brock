/* @layer tooling-scripts @kind logic */
import { withBrockAppProp } from '../../src/upgrade/codemods/brock-app-prop.mjs';

const MAIN = /(^|\/)src\/main\.tsx$/;

const apply = ({ path, source }) => ({
  source: MAIN.test(path) ? withBrockAppProp(source, { prop: 'toolbars', name: 'appToolbars', from: '../.brock/toolbars' }) : source,
  todos: [],
});

const migration = Object.freeze({
  id: 'toolbar-files',
  summary: 'Docked toolbars by convention: src/toolbars/<id>.toolbar.tsx files are listed by brock sync in .brock/toolbars.ts. src/main.tsx gets toolbars={appToolbars} on BrockApp and the import beside the other .brock imports, so a new toolbar file takes effect with no hand wiring.',
  files: MAIN,
  apply,
});

export { migration };
