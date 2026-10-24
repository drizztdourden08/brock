/* @layer renderer-shell @kind component */
import { useMemo } from 'react';
import { PressedGrid } from '../../compounds/PressedGrid';
import { Card, Flex, Text } from '@drizztdourden08/tessera/primitives';
import { inputFamilyOf } from '../../compounds/CalibrationPanel';
import { shownDeviceCardActions } from '../shown-device-card-actions';
import { useDeviceCardActionStore } from '../useDeviceCardActionStore';
import { readButtons } from './behavior/read-buttons';
import { useDeviceCard } from './behavior/useDeviceCard';
import { NO_DEVICE_ACTIONS } from './DeviceCard.constants';
import { ActiveCalibration } from './sub-components/ActiveCalibration';
import { AxesPanel } from './sub-components/AxesPanel';
import { DeviceActions } from './sub-components/DeviceActions';
import { DeviceBadges } from './sub-components/DeviceBadges';
import { RumbleActions } from './sub-components/RumbleActions';
import type { DeviceCardProps } from './DeviceCard.type';
import './DeviceCard.css';

const DeviceCard = (props: DeviceCardProps) => {
  const { entry, actions = NO_DEVICE_ACTIONS } = props;
  const { deviceKey, name, product, vendorId, mapping, hasRumble, hasButton = [], hasAxis = [], buttonLabels = [] } = entry;
  const family = inputFamilyOf(vendorId);
  const card = useDeviceCard(deviceKey);
  const groups = useDeviceCardActionStore((s) => s.groups);
  const shown = useMemo(() => shownDeviceCardActions(groups.flat(), actions, entry), [groups, actions, entry]);
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
        <DeviceActions entry={entry} actions={shown} />
        {mapping && <Text className="device-card__mapping">{mapping}</Text>}
      </Flex>
    </Card>
  );
};

export { DeviceCard };
