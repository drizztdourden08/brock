/* @layer renderer-shell @kind component */
import { Button, Flex, Text } from '@drizztdourden08/tessera/primitives';
import { RUMBLE_PRESETS } from '../DeviceCard.constants';
import type { RumbleActionsProps } from './RumbleActions.type';

const RumbleActions = (props: RumbleActionsProps) => {
  const { error, onRumble } = props;

  return (
    <Flex align="center" gap="sm" wrap>
      <Text variant="label">Rumble</Text>
      {RUMBLE_PRESETS.map((preset) => (
        <Button key={preset.key} variant="tertiary" size="sm" onClick={() => onRumble(preset)}>
          {preset.label}
        </Button>
      ))}
      {error && <Text variant="caption">{error}</Text>}
    </Flex>
  );
};

export { RumbleActions };
