/* @layer renderer-shell @kind component */
import { CalibrationPanel } from '@drizztdourden08/tessera/composites';
import { ProgressBar, Slider, Stack, StatRow } from '@drizztdourden08/tessera/primitives';
import { useTriggerCalibration } from './behavior/useTriggerCalibration';
import { TRIGGER_STEP_TEXT } from './TriggerCalibrationPanel.constants';
import type { TriggerCalibrationPanelProps } from './TriggerCalibrationPanel.type';

const TriggerCalibrationPanel = (props: TriggerCalibrationPanelProps) => {
  const { slot, onClose } = props;
  const { step, action, readout, value, peak, deadzone, setDeadzone } = useTriggerCalibration(props);

  return (
    <CalibrationPanel
      title={`Calibrate ${slot.label}`}
      instruction={TRIGGER_STEP_TEXT[step]}
      readout={readout}
      action={action}
      onCancel={onClose}
    >
      <Stack gap="xs">
        <StatRow label={slot.label} value={value.toFixed(2)} mono />
        <ProgressBar value={value} max={1} secondaryValue={step === 'rest' ? undefined : peak} live />
      </Stack>
      {step === 'review' && (
        <Slider label="Dead zone" value={deadzone} min={0} max={0.3} step={0.01} onChange={setDeadzone} showValue />
      )}
    </CalibrationPanel>
  );
};

export { TriggerCalibrationPanel };
