/* @layer renderer-components @kind component */
import { Icon, Image } from '@drizztdourden08/tessera/primitives';
import type { DeviceIconProps } from './DeviceIcon.type';
import './DeviceIcon.css';

const DeviceIcon = ({ src, family, ready }: DeviceIconProps) => {
  if (!src) return <Icon name={family === 'keyboard' ? 'keyboard' : 'gamepad-2'} />;
  return (
    <Image src={src} alt={family} className={`device-icon ${ready ? 'device-icon--ready' : 'device-icon--unavailable'}`} />
  );
};

export { DeviceIcon };
