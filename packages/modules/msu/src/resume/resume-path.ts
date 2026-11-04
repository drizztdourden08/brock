/* @layer core @kind logic */
import type { MsuGameConfig } from '../config';
import type { ResumeSlot } from './resume.type';

const resumePath = (config: MsuGameConfig, slot: ResumeSlot): string =>
  config.resumePath(slot.profile, slot.slotKind, slot.slotId);

export { resumePath };
