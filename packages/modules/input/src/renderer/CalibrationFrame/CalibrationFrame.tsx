/* @layer renderer-shell @kind component */
import { Box, Button, Flex, Text } from '@drizztdourden08/tessera/primitives';
import type { CalibrationFrameProps } from './CalibrationFrame.type';
import './CalibrationFrame.css';

const CalibrationFrame = (props: CalibrationFrameProps) => {
  const { title, instruction, readout, action, onCancel, children } = props;

  return (
    <Box className="calibration-frame">
      <Flex direction="column" gap="sm">
        <Text className="calibration-frame__title">{title}</Text>
        <Text className="calibration-frame__instruction">{instruction}</Text>
        <Text className="calibration-frame__readout">{readout}</Text>
        {children}
        <Flex gap="sm" justify="end">
          <Button variant="ghost" size="sm" onClick={onCancel}>Cancel</Button>
          <Button variant="primary" size="sm" disabled={action.disabled} onClick={action.run}>{action.label}</Button>
        </Flex>
      </Flex>
    </Box>
  );
};

export { CalibrationFrame };
