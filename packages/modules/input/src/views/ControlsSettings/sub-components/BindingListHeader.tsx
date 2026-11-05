/* @layer renderer-components @kind component */
import { Box, Text } from '@drizztdourden08/tessera/primitives';
import type { BindingListHeaderProps } from './BindingListHeader.type';

const BindingListHeader = ({ actionLabel, bindingLabel, middleLabel = '' }: BindingListHeaderProps) => {
  return (
    <Box className="binding-row binding-row--header">
      <Text className="binding-row__action-label">{actionLabel}</Text>
      <Box className="binding-row__rest">
        <Box className="binding-row__icon-slot" />
        <Text className="binding-row__middle-label">{middleLabel}</Text>
        <Box className="binding-row__icon-slot" />
        <Text className="binding-row__binding-label">{bindingLabel}</Text>
      </Box>
    </Box>
  );
};

export { BindingListHeader };
