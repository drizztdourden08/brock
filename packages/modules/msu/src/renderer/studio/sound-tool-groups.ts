/* @layer renderer-shell @kind logic */
import { createElement } from 'react';
import { Checkbox } from '@drizztdourden08/tessera/primitives';
import type { ToolGroup } from '@drizztdourden08/tessera/primitives';
import { sectionGroup } from './studio-frame/section-group';
import { soundFindGroup } from './sound-find-group';
import type { SoundToolGroupsProps } from './sound-tool-groups.type';

const soundToolGroups = (props: SoundToolGroupsProps): ToolGroup[] => {
  const { tabs, placeholder, unreachableCount, filter, showUnreachable, onFilterChange, onShowUnreachableChange, t } = props;
  const groups: ToolGroup[] = [sectionGroup(tabs, t), soundFindGroup(placeholder, filter, onFilterChange, t)];
  if (unreachableCount === 0) return groups;

  return [
    ...groups,
    {
      id: 'show',
      label: t('msu:tool.show'),
      content: createElement(Checkbox, {
        checked: showUnreachable, onChange: onShowUnreachableChange, label: t('msu:tool.showUnreachable', { count: unreachableCount }),
      }),
    },
  ];
};

export { soundToolGroups };
