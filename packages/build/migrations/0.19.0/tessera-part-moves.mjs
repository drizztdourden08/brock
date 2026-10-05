/* @layer tooling-scripts @kind logic */
import { importMoves } from '../../src/upgrade/index.mjs';

const PRIMITIVES = '@drizztdourden08/tessera/primitives';

const COMPOSITES = '@drizztdourden08/tessera/composites';

const MOVES = Object.freeze([
  { from: PRIMITIVES, to: COMPOSITES, names: new Set(['CopyButton', 'CopyButtonProps', 'CopyButtonSize', 'CopyText', 'CopyValue', 'CopyValueProps', 'CopyValueSize', 'CopyValueTruncate']) },
  { from: COMPOSITES, to: PRIMITIVES, names: new Set(['ErrorBoundary', 'ErrorBoundaryProps']) },
]);

const NO_TYPESCRIPT = 'Tessera 0.17 moved CopyButton and CopyValue to @drizztdourden08/tessera/composites and ErrorBoundary to @drizztdourden08/tessera/primitives only. TypeScript is not installed, so this file was not read: move those imports by hand, or import them from @drizztdourden08/tessera.';

const migration = Object.freeze({
  id: 'tessera-part-moves',
  summary: 'Tessera 0.17 moved CopyButton, CopyValue and their types from /primitives to /composites, and ErrorBoundary to /primitives only. Imports of them through the old entry point move to the new one; the root import is left alone.',
  files: /(^|\/)src\/.+\.[cm]?[jt]sx?$/,
  apply: importMoves({ moves: MOVES, noTypescript: NO_TYPESCRIPT }),
});

export { migration };
