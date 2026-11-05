/* @layer renderer-components @kind logic */
import type { ActionRow, BuildActionRowsParams } from './controls-behavior.type';
import { actionRow } from './action-row';

/** One row per bound mapping of each action, or one empty row when the action has none. */
const buildActionRows = ({ actions, mappings, multiController, devices }: BuildActionRowsParams): ActionRow[] =>
  actions.flatMap((action) => {
    const bound = mappings
      .map((mapping, mappingIndex) => ({ mapping, mappingIndex }))
      .filter(({ mapping }) => mapping.action === action.id);
    if (bound.length === 0) {
      return [actionRow({ action, mapping: undefined, mappingIndex: -1, multiController, devices })];
    }
    return bound.map(({ mapping, mappingIndex }) => actionRow({ action, mapping, mappingIndex, multiController, devices }));
  });

export { buildActionRows };
