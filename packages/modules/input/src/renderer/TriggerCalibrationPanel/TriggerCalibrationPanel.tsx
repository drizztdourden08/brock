/* @layer renderer-shell @kind component */
import { Slider } from '@drizztdourden08/tessera/primitives';
import { CalibrationFrame } from '../CalibrationFrame';
import { useTriggerCalibration } from './behavior/useTriggerCalibration';
import { TRIGGER_STEP_TEXT } from './TriggerCalibrationPanel.constants';
import type { TriggerCalibrationPanelProps } from './TriggerCalibrationPanel.type';

const TriggerCalibrationPanel = (props: TriggerCalibrationPanelProps) => {
  const { slot, onClose } = props;
  const { step, action, readout, deadzone, setDeadzone } = useTriggerCalibration(props);

  return (
    <CalibrationFrame
      title={`Calibrate ${slot.label}`}
      instruction={TRIGGER_STEP_TEXT[step]}
      readout={readout}
      action={action}
      onCancel={onClose}
    >
      {step === 'review' && (
        <Slider label="Dead zone" value={deadzone} min={0} max={0.3} step={0.01} onChange={setDeadzone} showValue />
      )}
    </CalibrationFrame>
  );
};

export { TriggerCalibrationPanel };
