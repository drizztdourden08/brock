/* @layer renderer-shell @kind component */
import { CalibrationPanel, StickPlot } from '@drizztdourden08/tessera/composites';
import { Slider } from '@drizztdourden08/tessera/primitives';
import { useStickCalibration } from './behavior/useStickCalibration';
import { STICK_STEP_TEXT } from './StickCalibrationPanel.constants';
import type { StickCalibrationPanelProps } from './StickCalibrationPanel.type';

const StickCalibrationPanel = (props: StickCalibrationPanelProps) => {
  const { slot, onClose } = props;
  const { step, action, readout, x, y, center, range, innerDeadzone, setInner, outerDeadzone, setOuter } = useStickCalibration(props);
  const measured = step !== 'center';

  return (
    <CalibrationPanel
      title={`Calibrate ${slot.label}`}
      instruction={STICK_STEP_TEXT[step]}
      readout={readout}
      action={action}
      onCancel={onClose}
    >
      <StickPlot
        x={x}
        y={y}
        size="lg"
        showValue={false}
        center={measured ? center : undefined}
        range={measured ? range : undefined}
        innerDeadzone={innerDeadzone}
        outerDeadzone={outerDeadzone}
      />
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
