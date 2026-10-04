/* @layer renderer-shell @kind component */
import { SettingsSection } from '@drizztdourden08/tessera/composites';
import { deadZonePercent } from '../dead-zone-percent';
import { CalibrationPanel } from '../../compounds/CalibrationPanel';
import { useStickCalibration } from './behavior/useStickCalibration';
import { STICK_STEP_TEXT } from './StickCalibrationPanel.constants';
import type { StickCalibrationPanelProps } from './StickCalibrationPanel.type';

const StickCalibrationPanel = (props: StickCalibrationPanelProps) => {
  const { slot, buttons, family, onClose } = props;
  const { step, action, readout, x, y, center, range, innerDeadzone, setInner, outerDeadzone, setOuter } = useStickCalibration(props);
  const measured = step !== 'center';

  return (
    <CalibrationPanel
      title={`Calibrate ${slot.label}`}
      instruction={STICK_STEP_TEXT[step]}
      reading={{
        kind: 'stick',
        name: slot.side === 'left' ? 'LEFT_STICK' : 'RIGHT_STICK',
        label: slot.label,
        x,
        y,
        center: measured ? center : undefined,
        range: measured ? range : undefined,
        innerDeadzone,
        outerDeadzone,
      }}
      buttons={buttons}
      family={family}
      readout={readout}
      action={action}
      onCancel={onClose}
    >
      {step === 'review' && (
        <SettingsSection
          rows={[
            {
              id: 'innerDeadzone',
              title: 'Inner dead zone',
              description: 'How far the stick moves from its center before it counts.',
              hint: 'Raise it if the stick drifts at rest. Too high and small moves get lost.',
              input: { kind: 'slider', value: innerDeadzone, min: 0, max: 0.5, step: 0.01, formatValue: deadZonePercent, onChange: setInner },
            },
            {
              id: 'outerDeadzone',
              title: 'Outer dead zone',
              description: 'How far out the stick reads as fully pushed.',
              hint: 'Lower it if a full push never reaches the edge. The ring on the plot shows where it starts.',
              input: { kind: 'slider', value: outerDeadzone, min: 0.5, max: 1, step: 0.01, formatValue: deadZonePercent, onChange: setOuter },
            },
          ]}
        />
      )}
    </CalibrationPanel>
  );
};

export { StickCalibrationPanel };
