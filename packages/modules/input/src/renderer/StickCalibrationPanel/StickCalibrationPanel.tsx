/* @layer renderer-shell @kind component */
import { Slider } from '@drizztdourden08/tessera/primitives';
import { CalibrationPanel } from '../../compounds/CalibrationPanel';
import { useStickCalibration } from './behavior/useStickCalibration';
import { STICK_STEP_TEXT } from './StickCalibrationPanel.constants';
import type { StickCalibrationPanelProps } from './StickCalibrationPanel.type';

const StickCalibrationPanel = (props: StickCalibrationPanelProps) => {
  const { slot, buttons, onClose } = props;
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
      readout={readout}
      action={action}
      onCancel={onClose}
    >
      {step === 'review' && (
        <>
          <Slider label="Inner dead zone" value={innerDeadzone} min={0} max={0.5} step={0.01} onChange={setInner} showValue />
          <Slider label="Outer dead zone" value={outerDeadzone} min={0.5} max={1} step={0.01} onChange={setOuter} showValue />
        </>
      )}
    </CalibrationPanel>
  );
};

export { StickCalibrationPanel };
