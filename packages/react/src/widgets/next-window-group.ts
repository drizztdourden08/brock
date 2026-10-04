/* @layer renderer-shell @kind logic */
import type { WidgetWindowGroup } from '@drizztdourden08/brock-core';
import type { WindowGroupOption } from './widget.type';

const nextWindowGroup = (current: WidgetWindowGroup | null, groups: readonly WindowGroupOption[]): WidgetWindowGroup | null => {
  const at = groups.findIndex((option) => option.id === current);
  return groups[at + 1]?.id ?? null;
};

export { nextWindowGroup };
