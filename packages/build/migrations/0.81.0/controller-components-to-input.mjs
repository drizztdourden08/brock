/* @layer tooling-scripts @kind logic */
import { importMoves } from '../../src/upgrade/index.mjs';

const TESSERA = '@drizztdourden08/tessera';

const COMPOSITES = '@drizztdourden08/tessera/composites';

const INPUT = '@drizztdourden08/brock-input/renderer';

const NAMES = new Set([
  'ControllerLayout', 'ControllerLayoutProps', 'ControllerLayoutVariant', 'ControllerExtra', 'ControllerSlots', 'ControllerSlotId', 'ControllerSlotState',
  'CONTROLLER_LAYOUT_VARIANTS', 'CONTROLLER_SLOT_IDS',
  'StickPlot', 'StickPlotPoint', 'StickPlotProps', 'StickPlotRange', 'StickPlotSize',
  'PressedGrid', 'PressedGridItem', 'PressedGridProps',
]);

const MOVES = Object.freeze([
  { from: COMPOSITES, to: INPUT, names: NAMES },
  { from: TESSERA, to: INPUT, names: NAMES },
]);

const NO_TYPESCRIPT = 'ControllerLayout, StickPlot and PressedGrid moved from Tessera to the Brock input module. TypeScript is not installed, so this file was not read: import them and their types from @drizztdourden08/brock-input/renderer by hand.';

const migration = Object.freeze({
  id: 'controller-components-to-input',
  summary: 'ControllerLayout, StickPlot and PressedGrid, with their props and types, leave Tessera for the input module. Imports of them from @drizztdourden08/tessera or its /composites entry move to @drizztdourden08/brock-input/renderer, which needs the input module installed.',
  files: /(^|\/)src\/.+\.[cm]?[jt]sx?$/,
  apply: importMoves({ moves: MOVES, noTypescript: NO_TYPESCRIPT }),
});

export { migration };
