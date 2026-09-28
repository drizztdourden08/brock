/* @layer renderer-shell @kind component */
import { Box, Text } from '@drizztdourden08/tessera/primitives';
import { partitionByLock } from '../../behavior/partition-by-lock';
import type { SettingsGroupProps } from './SettingsGroup.type';

const SettingsGroup = (props: SettingsGroupProps) => {
  const { group, lockOf, lockOverlay, renderRow } = props;
  return (
    <Box className="settings-layout__subsection" data-section={group.id ?? undefined}>
      {group.title && <Text as="h3" className="settings-layout__subsection-title">{group.title}</Text>}
      <Box className="settings-layout__group">
        {partitionByLock(group.items, lockOf).map((run, runIndex) => {
          const rows = run.items.map((item) => (
            <Box key={item.key} data-setting-key={item.key} className="settings-layout__row">
              {renderRow(item)}
            </Box>
          ));
          if (run.lock === null) return rows;
          return <Box key={`locked-${runIndex}`}>{lockOverlay({ cause: run.lock, children: rows })}</Box>;
        })}
      </Box>
    </Box>
  );
};

export { SettingsGroup };
