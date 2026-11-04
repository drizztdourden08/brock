/* @layer core @kind logic */
import type { FileStore } from '@drizztdourden08/brock-core';
import type { MsuGameConfig } from '../config';
import type { MsuResumeState } from '../types';
import { isResumeState } from './is-resume-state';
import type { ResumeSlot } from './resume.type';
import { resumePath } from './resume-path';

const readMsuResume = async (
  config: MsuGameConfig, files: FileStore, slot: ResumeSlot,
): Promise<MsuResumeState | null> => {
  const text = await files.readText(resumePath(config, slot));
  if (text == null) return null;
  try {
    const parsed: unknown = JSON.parse(text);
    return isResumeState(parsed) ? parsed : null;
  } catch { return null; }
};

export { readMsuResume };
