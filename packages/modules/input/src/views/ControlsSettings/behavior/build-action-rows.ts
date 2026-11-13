/* @layer renderer-components @kind logic */
import type { ActionGroupRow, BuildActionRowsParams } from './controls-behavior.type';
import { actionRow } from './action-row';

const buildActionRows = ({ actions, mappings, multiController, devices }: BuildActionRowsParams): ActionGroupRow[] =>
  actions.map((action) => {
    const bound = mappings
      .map((mapping, mappingIndex) => ({ mapping, mappingIndex }))
      .filter(({ mapping }) => mapping.action === action.id);
    const cells = bound.length === 0
      ? [actionRow({ action, mapping: undefined, mappingIndex: -1, multiController, devices })]
      : bound.map(({ mapping, mappingIndex }) => actionRow({ action, mapping, mappingIndex, multiController, devices }));
    return { action, cells };
  });

export { buildActionRows };
