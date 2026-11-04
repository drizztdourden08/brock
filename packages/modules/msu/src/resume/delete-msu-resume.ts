/* @layer core @kind logic */
import type { FileStore } from '@drizztdourden08/brock-core';
import type { MsuGameConfig } from '../config';
import type { ResumeSlot } from './resume.type';
import { resumePath } from './resume-path';

const deleteMsuResume = (config: MsuGameConfig, files: FileStore, slot: ResumeSlot): Promise<void> =>
  files.remove(resumePath(config, slot));

export { deleteMsuResume };
