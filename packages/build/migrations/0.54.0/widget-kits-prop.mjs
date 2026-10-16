/* @layer tooling-scripts @kind logic */
import { withBrockAppProp } from '../../src/upgrade/codemods/brock-app-prop.mjs';

const MAIN = /(^|\/)src\/main\.tsx$/;
const WIRING = { prop: 'widgetKits', name: 'appWidgetKits', from: '../.brock/widget-kits' };

const apply = ({ path, source }) => ({ source: MAIN.test(path) ? withBrockAppProp(source, WIRING) : source, todos: [] });

const migration = Object.freeze({
  id: 'widget-kits-prop',
  summary: 'Widget kits by convention: src/widgets/<id>.kit.ts and the <id>.overlay.tsx files that name it are listed by brock sync in .brock/widget-kits.ts. src/main.tsx gets widgetKits={appWidgetKits} on BrockApp and the import beside the other .brock imports, so a new kit file takes effect with no hand wiring.',
  files: MAIN,
  apply,
});

export { migration };
