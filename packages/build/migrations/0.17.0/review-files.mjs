/* @layer tooling-scripts @kind logic */
import { withBrockAppProp } from '../../src/upgrade/codemods/brock-app-prop.mjs';

const MAIN = /(^|\/)src\/main\.tsx$/;
const WIRING = { prop: 'review', name: 'appReview', from: '../.brock/review' };

const apply = ({ source }) => ({ source: withBrockAppProp(source, WIRING), todos: [] });

const migration = Object.freeze({
  id: 'review-files',
  summary: 'The review takes the app\'s own seed and steps: brock sync lists src/review/seed.ts and src/review/<id>.step.ts in .brock/review.ts, and src/main.tsx gets review={appReview} on BrockApp with the import beside the other .brock imports.',
  files: MAIN,
  apply,
});

export { migration };
