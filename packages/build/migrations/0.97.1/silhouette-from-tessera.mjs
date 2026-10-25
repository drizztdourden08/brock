/* @layer tooling-scripts @kind logic */
import { importMoves } from '../../src/upgrade/index.mjs';

const COMPOSITES = '@drizztdourden08/tessera/composites';

const INPUT = '@drizztdourden08/brock-input/renderer';

const NAMES = new Set([
  'ControllerSilhouette', 'ControllerSilhouetteProps', 'CONTROLLER_SILHOUETTE_PATHS', 'CONTROLLER_SILHOUETTE_VIEW_BOX',
]);

const MOVES = Object.freeze([{ from: INPUT, to: COMPOSITES, names: NAMES }]);

const MENTIONS = /@drizztdourden08\/brock-input\/renderer/;

const NO_TYPESCRIPT = 'ControllerSilhouette comes from Tessera again. TypeScript is not installed, so this file was not read: import ControllerSilhouette, ControllerSilhouetteProps, CONTROLLER_SILHOUETTE_PATHS and CONTROLLER_SILHOUETTE_VIEW_BOX from @drizztdourden08/tessera/composites by hand.';

const migration = Object.freeze({
  id: 'silhouette-from-tessera',
  summary: 'ControllerSilhouette, its props type, CONTROLLER_SILHOUETTE_PATHS and CONTROLLER_SILHOUETTE_VIEW_BOX are Tessera\'s again. Imports of them from @drizztdourden08/brock-input/renderer move to @drizztdourden08/tessera/composites. The anchor table and its types stay in the input module.',
  files: /(^|\/)src\/.+\.[cm]?[jt]sx?$/,
  apply: importMoves({ moves: MOVES, noTypescript: NO_TYPESCRIPT, mentions: MENTIONS }),
});

export { migration };
