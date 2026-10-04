/* @layer electron-main @kind logic */
import type { WidgetWindowGroup } from '@drizztdourden08/brock-core';
import { groupMembers } from './group-members';
import { groupOf } from './group-of';

const activeGroup = (id: string): WidgetWindowGroup | null => {
  const group = groupOf(id);
  return groupMembers(group).length > 1 ? group : null;
};

export { activeGroup };
