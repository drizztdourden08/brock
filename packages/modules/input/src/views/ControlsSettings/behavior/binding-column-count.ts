/* @layer renderer-components @kind logic */
import { MAX_BINDING_COLUMNS } from '../ControlsSettings.constants';
import type { ActionGroupRow } from './controls-behavior.type';

const bindingColumnCount = (rows: readonly ActionGroupRow[], minimum: number): number =>
  Math.min(MAX_BINDING_COLUMNS, Math.max(minimum, ...rows.map((row) => row.cells.length)));

export { bindingColumnCount };
