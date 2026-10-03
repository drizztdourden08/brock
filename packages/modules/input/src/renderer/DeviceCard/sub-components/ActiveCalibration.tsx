/* @layer renderer-shell @kind component */
import { StickCalibrationPanel } from '../../StickCalibrationPanel';
import { TriggerCalibrationPanel } from '../../TriggerCalibrationPanel';
import type { ActiveCalibrationProps } from './ActiveCalibration.type';

const ActiveCalibration = (props: ActiveCalibrationProps) => {
  const { deviceKey, target, existing, buttons, onClose } = props;
  if (!target) return null;
  if (target.kind === 'stick') {
    return <StickCalibrationPanel deviceKey={deviceKey} slot={target.slot} existing={existing} buttons={buttons} onClose={onClose} />;
  }
  return <TriggerCalibrationPanel deviceKey={deviceKey} slot={target.slot} buttons={buttons} onClose={onClose} />;
};

export { ActiveCalibration };
