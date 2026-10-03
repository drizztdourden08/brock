/* @layer renderer-shell @kind hook */
import { useCallback, useState } from 'react';
import type { StickPoint } from '../../../calibration.type';
import { DEFAULT_INNER_DEADZONE, DEFAULT_OUTER_DEADZONE } from '../../../calibration/calibration.constants';
import type { CalibrationPanelAction } from '../../../compounds/CalibrationPanel';
import { useCalibrationStore } from '../../useCalibrationStore';
import { useControllerState } from '../../useControllerState';
import { MIN_STICK_SPAN } from '../StickCalibrationPanel.constants';
import type { StickCalibrationPanelProps, StickStep } from '../StickCalibrationPanel.type';
import { buildStickCalibration } from './build-stick-calibration';
import { useStickRange } from './useStickRange';

const useStickCalibration = (props: StickCalibrationPanelProps) => {
  const { deviceKey, slot, existing, onClose } = props;
  const { axes } = useControllerState(deviceKey);
  const saveStick = useCalibrationStore((s) => s.saveStick);
  const [step, setStep] = useState<StickStep>('center');
  const [center, setCenter] = useState<StickPoint>({ x: 0, y: 0 });
  const [innerDeadzone, setInner] = useState(existing?.[slot.side].innerDeadzone ?? DEFAULT_INNER_DEADZONE);
  const [outerDeadzone, setOuter] = useState(existing?.[slot.side].outerDeadzone ?? DEFAULT_OUTER_DEADZONE);
  const { range, setRange } = useStickRange(deviceKey, slot, step === 'range');
  const x = axes[slot.xAxis] ?? 0;
  const y = axes[slot.yAxis] ?? 0;
  const spanX = range.maxX - range.minX;
  const spanY = range.maxY - range.minY;

  const recordCenter = useCallback(() => {
    setCenter({ x, y });
    setRange({ minX: x, maxX: x, minY: y, maxY: y });
    setStep('range');
  }, [x, y, setRange]);

  const save = useCallback(async () => {
    const input = { side: slot.side, existing, center, range, innerDeadzone, outerDeadzone };
    await saveStick(deviceKey, buildStickCalibration(input));
    onClose();
  }, [slot.side, existing, center, range, innerDeadzone, outerDeadzone, saveStick, deviceKey, onClose]);

  const actions: Record<StickStep, CalibrationPanelAction> = {
    center: { label: 'Record center', disabled: false, onClick: recordCenter },
    range: { label: 'Next', disabled: spanX < MIN_STICK_SPAN || spanY < MIN_STICK_SPAN, onClick: () => setStep('review') },
    review: { label: 'Save', disabled: false, onClick: () => { void save(); } },
  };

  const readout = step === 'range'
    ? `span x ${spanX.toFixed(2)}  y ${spanY.toFixed(2)}`
    : `x ${x.toFixed(2)}  y ${y.toFixed(2)}`;

  return { step, action: actions[step], readout, x, y, center, range, innerDeadzone, setInner, outerDeadzone, setOuter };
};

export { useStickCalibration };
