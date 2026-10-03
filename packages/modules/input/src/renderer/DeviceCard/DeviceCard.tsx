/* @layer renderer-shell @kind component */
import { useMemo } from 'react';
import { PressedGrid } from '@drizztdourden08/tessera/composites';
import { Card, Flex, Text } from '@drizztdourden08/tessera/primitives';
import { inputFamilyOf } from '../../compounds/CalibrationPanel';
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
  const { deviceKey, name, product, vendorId, mapping, hasRumble, hasButton = [], hasAxis = [], buttonLabels = [] } = entry;
  const family = inputFamilyOf(vendorId);
  const card = useDeviceCard(deviceKey);
  const buttons = useMemo(() => readButtons(card.buttons, hasButton, buttonLabels, family), [card.buttons, hasButton, buttonLabels, family]);

  return (
    <Card className="device-card">
      <Flex direction="column" gap="md">
        <Flex direction="column" gap="xs">
          <Text className="device-card__name">{name ?? product}</Text>
          <DeviceBadges entry={entry} />
        </Flex>
        {!card.target && <PressedGrid family={family} items={buttons.items} pressed={buttons.pressed} />}
        <AxesPanel sticks={card.sticks} triggers={card.triggers} hasAxis={hasAxis} onCalibrate={card.setTarget} />
        <ActiveCalibration
          deviceKey={deviceKey}
          target={card.target}
          family={family}
          existing={card.stickCalibration}
          buttons={buttons}
          onClose={card.closeCalibration}
        />
        {hasRumble && <RumbleActions error={card.rumbleError} onRumble={(preset) => { void card.rumble(preset); }} />}
        {mapping && <Text className="device-card__mapping">{mapping}</Text>}
      </Flex>
    </Card>
  );
};

export { DeviceCard };
