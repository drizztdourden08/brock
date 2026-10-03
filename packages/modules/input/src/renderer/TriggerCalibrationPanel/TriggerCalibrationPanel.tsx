/* @layer renderer-shell @kind component */
import { Slider } from '@drizztdourden08/tessera/primitives';
import { SDL_AXIS_NAMES } from '../../input.constants';
import { CalibrationPanel } from '../../compounds/CalibrationPanel';
import { useTriggerCalibration } from './behavior/useTriggerCalibration';
import { TRIGGER_STEP_TEXT } from './TriggerCalibrationPanel.constants';
import type { TriggerCalibrationPanelProps } from './TriggerCalibrationPanel.type';

const TriggerCalibrationPanel = (props: TriggerCalibrationPanelProps) => {
  const { slot, buttons, onClose } = props;
  const { step, action, readout, value, peak, deadzone, setDeadzone } = useTriggerCalibration(props);

  return (
    <CalibrationPanel
      title={`Calibrate ${slot.label}`}
      instruction={TRIGGER_STEP_TEXT[step]}
      reading={{
        kind: 'trigger',
        name: SDL_AXIS_NAMES[slot.axisIndex] ?? slot.label,
        label: slot.label,
        value,
        peak: step === 'rest' ? undefined : peak,
      }}
      buttons={buttons}
      readout={readout}
      action={action}
      onCancel={onClose}
    >
      {step === 'review' && (
        <Slider label="Dead zone" value={deadzone} min={0} max={0.3} step={0.01} onChange={setDeadzone} showValue />
      )}
    </CalibrationPanel>
  );
};

export { TriggerCalibrationPanel };
