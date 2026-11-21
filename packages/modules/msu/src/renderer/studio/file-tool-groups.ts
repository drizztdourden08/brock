/* @layer renderer-shell @kind logic */
import { createElement } from 'react';
import { Checkbox, SearchInput } from '@drizztdourden08/tessera/primitives';
import type { ToolGroup } from '@drizztdourden08/tessera/primitives';
import { sectionGroup } from './studio-frame/section-group';
import type { FileToolGroupsProps } from './file-tool-groups.type';

const fileToolGroups = (props: FileToolGroupsProps): ToolGroup[] => {
  const { tabs, filter, coveredCount, supersededOnly, onFilterChange, onSupersededOnlyChange, t } = props;
  const groups: ToolGroup[] = [
    sectionGroup(tabs, t),
    {
      id: 'find',
      label: t('msu:tool.find'),
      content: createElement(SearchInput, {
        grow: false, value: filter, onChange: onFilterChange, placeholder: t('msu:tool.filePlaceholder'), 'aria-label': t('msu:tool.findFile'),
      }),
    },
  ];
  if (coveredCount === 0) return groups;

  return [
    ...groups,
    {
      id: 'show',
      label: t('msu:tool.show'),
      content: createElement(Checkbox, {
        checked: supersededOnly, label: t('msu:tool.supersededOnly', { count: coveredCount }), onChange: onSupersededOnlyChange,
      }),
    },
  ];
};

export { fileToolGroups };
