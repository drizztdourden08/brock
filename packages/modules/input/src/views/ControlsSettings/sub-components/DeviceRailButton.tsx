/* @layer renderer-components @kind component */
import { IconButton } from '@drizztdourden08/tessera/primitives';
import { useDeviceActions } from '../behavior/useDeviceActions';
import { DeviceIcon } from './DeviceIcon';
import type { DeviceRailButtonProps } from './DeviceRailButton.type';
import './DeviceRailButton.css';

const DeviceRailButton = ({ entry, onAssign }: DeviceRailButtonProps) => {
  const { handleDragStart, handleAssign } = useDeviceActions(entry, onAssign);
  const { drag, family, iconSrc, ready } = entry;

  return (
    <IconButton
      variant="ghost"
      label={drag.displayName}
      className="device-rail-button"
      draggable={ready}
      disabled={!ready}
      onDragStart={handleDragStart}
      onClick={handleAssign}
    >
      <DeviceIcon src={iconSrc} family={family} ready={ready} />
    </IconButton>
  );
};

export { DeviceRailButton };
