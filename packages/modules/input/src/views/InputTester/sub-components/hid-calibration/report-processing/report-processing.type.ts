/* @layer renderer-shell @kind types */
import type React from 'react';
import type { HidButtonMapping, StickCandidate } from '../hid-calibration.type';
import type { GyroReclaimRefs } from '../stick-gyro-reclaim';
import type { StickScanRefs, TriggerScanRefs } from '../scan-refs.type';

interface GyroRefs {
  gyroMinsRef: React.RefObject<Uint8Array>;
  gyroMaxsRef: React.RefObject<Uint8Array>;
  gyroBufferRef: React.RefObject<Uint8Array[]>;
}

interface StickRefs extends GyroReclaimRefs, StickScanRefs {
  capturedStickBytesRef: React.RefObject<Set<number>>;
  baselineRef: React.RefObject<Uint8Array>;
}

interface TriggerRefs extends TriggerScanRefs {
  capturedStickBytesRef: React.RefObject<Set<number>>;
  capturedTriggerBytesRef: React.RefObject<Set<number>>;
  excludedRef: React.RefObject<Set<number>>;
  baselineRef: React.RefObject<Uint8Array>;
}

interface StickFrameArgs {
  bytes: Uint8Array;
  refs: StickRefs;
  onLiveInfo: (info: string) => void;
  onFinalize: (c1: StickCandidate, c2: StickCandidate | null) => void;
  onStopRecording: () => void;
  addLog: (msg: string) => void;
}

interface TriggerFrameArgs {
  bytes: Uint8Array;
  refs: TriggerRefs;
  onLiveInfo: (info: string) => void;
  onFinalize: (c: StickCandidate) => void;
  onStopRecording: () => void;
  onFinalizeDigital: (mapping: HidButtonMapping) => void;
}

export type { GyroRefs, StickFrameArgs, StickRefs, TriggerFrameArgs, TriggerRefs };
