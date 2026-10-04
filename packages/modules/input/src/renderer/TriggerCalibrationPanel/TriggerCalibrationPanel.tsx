/* @layer renderer-shell @kind component */
import { SettingsSection } from '@drizztdourden08/tessera/composites';
import { deadZonePercent } from '../dead-zone-percent';
import { SDL_AXIS_NAMES } from '../../input.constants';
import { CalibrationPanel } from '../../compounds/CalibrationPanel';
import { useTriggerCalibration } from './behavior/useTriggerCalibration';
import { TRIGGER_STEP_TEXT } from './TriggerCalibrationPanel.constants';
import type { TriggerCalibrationPanelProps } from './TriggerCalibrationPanel.type';

const TriggerCalibrationPanel = (props: TriggerCalibrationPanelProps) => {
  const { slot, buttons, family, onClose } = props;
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
      family={family}
      readout={readout}
      action={action}
      onCancel={onClose}
    >
      {step === 'review' && (
        <SettingsSection
          rows={[{
            id: 'deadzone',
            title: 'Dead zone',
            description: 'How far the trigger moves before it counts.',
            hint: 'Raise it if the trigger reads a press at rest. Too high and light presses get lost.',
            input: { kind: 'slider', value: deadzone, min: 0, max: 0.3, step: 0.01, formatValue: deadZonePercent, onChange: setDeadzone },
          }]}
        />
      )}
    </CalibrationPanel>
  );
};

export { TriggerCalibrationPanel };
