/* @layer renderer-components @kind component */
import { Box, Text } from '@drizztdourden08/tessera/primitives';
import type { ActionListHeaderProps } from './ActionListHeader.type';

const ActionListHeader = ({ actionLabel, bindingLabel, middleLabel = '', columns }: ActionListHeaderProps) => (
  <Box className="action-row binding-row--header">
    <Text className="binding-row__action-label">{actionLabel}</Text>
    <Box className="action-row__middle">
      <Box className="binding-row__icon-slot" />
      <Text className="binding-row__middle-label">{middleLabel}</Text>
    </Box>
    {Array.from({ length: columns }, (_, slot) => (
      <Box key={slot} className="action-cell action-cell--header">
        <Box className="binding-row__icon-slot" />
        <Text className="binding-row__binding-label">{columns > 1 ? `${bindingLabel} ${slot + 1}` : bindingLabel}</Text>
      </Box>
    ))}
  </Box>
);

export { ActionListHeader };
