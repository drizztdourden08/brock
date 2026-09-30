/* @layer renderer-shell @kind hook */
import { useCallback, useState } from 'react';
import { DEFAULT_TRIGGER_DEADZONE } from '../../../calibration/calibration.constants';
import type { CalibrationPanelAction } from '@drizztdourden08/tessera/composites';
import { useCalibrationStore } from '../../useCalibrationStore';
import { useControllerState } from '../../useControllerState';
import { MIN_TRIGGER_TRAVEL } from '../TriggerCalibrationPanel.constants';
import type { TriggerCalibrationPanelProps, TriggerStep } from '../TriggerCalibrationPanel.type';
import { useTriggerPeak } from './useTriggerPeak';

const useTriggerCalibration = (props: TriggerCalibrationPanelProps) => {
  const { deviceKey, slot: { axisIndex }, onClose } = props;
  const { axes } = useControllerState(deviceKey);
  const existing = useCalibrationStore((s) => s.triggers[`${deviceKey}:${axisIndex}`]);
  const saveTrigger = useCalibrationStore((s) => s.saveTrigger);
  const [step, setStep] = useState<TriggerStep>('rest');
  const [base, setBase] = useState(0);
  const [deadzone, setDeadzone] = useState(existing?.deadzone ?? DEFAULT_TRIGGER_DEADZONE);
  const { peak, setPeak } = useTriggerPeak(deviceKey, axisIndex, step === 'press');
  const value = axes[axisIndex] ?? 0;

  const recordRest = useCallback(() => {
    setBase(value);
    setPeak(value);
    setStep('press');
  }, [value, setPeak]);

  const save = useCallback(async () => {
    await saveTrigger(deviceKey, axisIndex, { base, max: peak, deadzone });
    onClose();
  }, [saveTrigger, deviceKey, axisIndex, base, peak, deadzone, onClose]);

  const actions: Record<TriggerStep, CalibrationPanelAction> = {
    rest: { label: 'Record rest', disabled: false, onClick: recordRest },
    press: { label: 'Next', disabled: peak - base < MIN_TRIGGER_TRAVEL, onClick: () => setStep('review') },
    review: { label: 'Save', disabled: false, onClick: () => { void save(); } },
  };

  const readout = `value ${value.toFixed(2)}  rest ${base.toFixed(2)}  peak ${peak.toFixed(2)}`;

  return { step, action: actions[step], readout, value, peak, deadzone, setDeadzone };
};

export { useTriggerCalibration };
