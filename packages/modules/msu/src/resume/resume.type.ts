/* @layer core @kind types */
import type { FileStore } from '@drizztdourden08/brock-core';
import type { MsuGameConfig } from '../config';
import type { MsuResumeState } from '../types';

interface ResumeSlot {
  profile: string;
  slotKind: string;
  slotId: string | number;
}

interface WriteMsuResumeParams {
  config: MsuGameConfig;
  files: FileStore;
  slot: ResumeSlot;
  state: MsuResumeState;
}

export type { ResumeSlot, WriteMsuResumeParams };
