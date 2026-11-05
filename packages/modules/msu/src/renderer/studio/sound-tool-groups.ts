/* @layer renderer-shell @kind logic */
import { createElement } from 'react';
import { Checkbox } from '@drizztdourden08/tessera/primitives';
import type { ToolGroup } from '@drizztdourden08/tessera/primitives';
import { sectionGroup } from './studio-frame/section-group';
import { soundFindGroup } from './sound-find-group';
import type { SoundToolGroupsProps } from './sound-tool-groups.type';

const soundToolGroups = (props: SoundToolGroupsProps): ToolGroup[] => {
  const { tabs, placeholder, unreachableCount, filter, showUnreachable, onFilterChange, onShowUnreachableChange } = props;
  const groups: ToolGroup[] = [sectionGroup(tabs), soundFindGroup(placeholder, filter, onFilterChange)];
  if (unreachableCount === 0) return groups;

  return [
    ...groups,
    {
      id: 'show',
      label: 'Show',
      content: createElement(Checkbox, {
        checked: showUnreachable, onChange: onShowUnreachableChange, label: `Show ${unreachableCount} unreachable ids`,
      }),
    },
  ];
};

export { soundToolGroups };
