/* @layer tooling-scripts @kind logic */
import { withBrockAppProp } from '../../src/upgrade/codemods/brock-app-prop.mjs';

const MAIN = /(^|\/)src\/main\.tsx$/;

const apply = ({ path, source }) => ({
  source: MAIN.test(path) ? withBrockAppProp(source, { prop: 'tours', name: 'appTours', from: '../.brock/tours' }) : source,
  todos: [],
});

const migration = Object.freeze({
  id: 'tour-files',
  summary: 'Guided tours by convention: src/tours/<id>.tour.ts files are listed by brock sync in .brock/tours.ts. src/main.tsx gets tours={appTours} on BrockApp and the import beside the other .brock imports.',
  files: MAIN,
  apply,
});

export { migration };
