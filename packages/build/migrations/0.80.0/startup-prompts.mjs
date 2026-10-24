/* @layer tooling-scripts @kind logic */
import { withBrockAppProp } from '../../src/upgrade/codemods/brock-app-prop.mjs';

const MAIN = /(^|\/)src\/main\.tsx$/;

const WIRING = { prop: 'startupPrompts', name: 'appStartupPrompts', from: '../.brock/startup' };

const apply = ({ path, source }) => ({
  source: MAIN.test(path) ? withBrockAppProp(source, WIRING) : source,
  todos: [],
});

const migration = Object.freeze({
  id: 'startup-prompts',
  summary: 'Start-up prompts by convention: src/startup/<id>.prompt.ts files are listed by brock sync in .brock/startup.ts. src/main.tsx gets startupPrompts={appStartupPrompts} on BrockApp and the import beside the other .brock imports.',
  files: MAIN,
  apply,
});

export { migration };
