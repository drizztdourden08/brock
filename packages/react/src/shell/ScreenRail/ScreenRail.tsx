/* @layer renderer-shell @kind component */
import { Box, Text } from '@drizztdourden08/tessera/primitives';
import { useRailEntries } from './behavior/useRailEntries';
import { RailItem } from './sub-components/RailItem';
import type { ScreenRailProps } from './ScreenRail.type';
import './ScreenRail.css';

const ScreenRail = (props: ScreenRailProps) => {
  const { screens, home, groups: labels, collapsed = false, className = '' } = props;
  const { groups, select } = useRailEntries(screens, home, labels);
  const railClass = ['screen-rail', collapsed && 'screen-rail--collapsed', className].filter(Boolean).join(' ');

  return (
    <Box as="nav" className={railClass} aria-label="Screens">
      {groups.map((group) => (
        <Box key={group.id ?? ''} className="screen-rail__group" role="group" aria-label={group.label || undefined}>
          {group.id !== null && <Text as="span" className="screen-rail__group-label">{group.label}</Text>}
          {group.entries.map((entry) => <RailItem key={entry.id} entry={entry} onSelect={select} />)}
        </Box>
      ))}
    </Box>
  );
};

export { ScreenRail };
