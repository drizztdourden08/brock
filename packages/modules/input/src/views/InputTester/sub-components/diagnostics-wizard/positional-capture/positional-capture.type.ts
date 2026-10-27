/* @layer renderer-shell @kind types */
import type { RefObject } from 'react';
import type { ControllerJoystickSample } from '../../../../../capture.type';
import type { ResolvedDevice } from '../../../../../family';
import type { InputItem } from '../../hid-calibration/hid-calibration.type';
import type { usePositionalActions } from './usePositionalActions';
import type { usePositionalSession } from './usePositionalSession';

interface PositionalTarget {
  id: string;
  kind: 'button' | 'axis';
  label: string;
  category: string;
  expectedIndex: number | null;
}

interface PositionalCaptureRecord {
  id: string;
  kind: 'button' | 'axis';
  askedLabel: string;
  status: 'captured' | 'skipped';
  firedIndex: number | null;
  firedPositionalName: string | null;
  expectedIndex: number | null;
  mismatch: boolean;
}

type CellState = 'done' | 'skipped' | 'current' | 'pending';

type CallMode = 'act' | 'done' | 'idle';

interface CallInput {
  current: InputItem | null;
  instruction: string;
  answered: number;
  total: number;
  paused: boolean;
}

interface RecordOutcome {
  kind: 'match' | 'mismatch' | 'skipped';
  text: string;
}

type AxisRanges = { min: number; max: number }[];

interface UsePositionalOneByOneProps {
  deviceKey: string | null;
  active: boolean;
  resolvedDevice: ResolvedDevice | null;
  autoCapture: boolean;
  onAutoCaptureChange: (on: boolean) => void;
}

interface PositionalRefs {
  targetsRef: RefObject<PositionalTarget[]>;
  trimmedRef: RefObject<boolean>;
  activeIndexRef: RefObject<number>;
  inputPhaseActiveRef: RefObject<boolean>;
  autoAdvanceRef: RefObject<boolean>;
  baselineRef: RefObject<ControllerJoystickSample | null>;
  latestSampleRef: RefObject<ControllerJoystickSample | null>;
  rangesRef: RefObject<AxisRanges>;
  awaitingRestRef: RefObject<boolean>;
}

type PositionalAnswer = (status: PositionalCaptureRecord['status'], firedIndex: number | null) => void;

type PositionalSession = ReturnType<typeof usePositionalSession>;

interface AutoCaptureParams {
  session: PositionalSession;
  actions: ReturnType<typeof usePositionalActions>;
  active: boolean;
  autoCapture: boolean;
  onAutoCaptureChange: (on: boolean) => void;
}

interface SampleParams {
  refs: PositionalRefs;
  sample: ControllerJoystickSample;
  onAnswer: PositionalAnswer;
  onItemsChange: (items: InputItem[]) => void;
}

export type {
  AutoCaptureParams, AxisRanges, CallInput, CallMode, CellState, RecordOutcome, PositionalCaptureRecord, PositionalRefs, PositionalSession, PositionalTarget,
  SampleParams, UsePositionalOneByOneProps,
};
