/* @layer renderer-shell @kind component */
import { useMemo } from 'react';
import { PressedGrid } from '@drizztdourden08/tessera/composites';
import { Card, Flex, Text } from '@drizztdourden08/tessera/primitives';
import { readButtons } from './behavior/read-buttons';
import { useDeviceCard } from './behavior/useDeviceCard';
import { ActiveCalibration } from './sub-components/ActiveCalibration';
import { AxesPanel } from './sub-components/AxesPanel';
import { DeviceBadges } from './sub-components/DeviceBadges';
import { RumbleActions } from './sub-components/RumbleActions';
import type { DeviceCardProps } from './DeviceCard.type';
import './DeviceCard.css';

const DeviceCard = (props: DeviceCardProps) => {
  const { entry } = props;
  const { deviceKey, name, product, mapping, hasRumble, hasButton = [], hasAxis = [], buttonLabels = [] } = entry;
  const card = useDeviceCard(deviceKey);
  const buttons = useMemo(() => readButtons(card.buttons, hasButton, buttonLabels), [card.buttons, hasButton, buttonLabels]);

  return (
    <Card className="device-card">
      <Flex direction="column" gap="md">
        <Flex direction="column" gap="xs">
          <Text className="device-card__name">{name ?? product}</Text>
          <DeviceBadges entry={entry} />
        </Flex>
        <PressedGrid items={buttons.items} pressed={buttons.pressed} />
        <AxesPanel sticks={card.sticks} triggers={card.triggers} hasAxis={hasAxis} onCalibrate={card.setTarget} />
        <ActiveCalibration
          deviceKey={deviceKey}
          target={card.target}
          existing={card.stickCalibration}
          onClose={card.closeCalibration}
        />
        {hasRumble && <RumbleActions error={card.rumbleError} onRumble={(preset) => { void card.rumble(preset); }} />}
        {mapping && <Text className="device-card__mapping">{mapping}</Text>}
      </Flex>
    </Card>
  );
};

export { DeviceCard };
