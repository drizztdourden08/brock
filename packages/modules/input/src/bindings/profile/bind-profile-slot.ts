/* @layer core @kind logic */
import { bindMapping } from './bind-mapping';
import type { BindProfileSlotParams } from './profile.type';

const bindProfileSlot = ({ profile, action, slot = 0, binding, vid, pid }: BindProfileSlotParams) => {
  const owned = profile.mappings.flatMap((mapping, index) => (mapping.action === action ? [index] : []));
  const target = owned[slot];
  const mappings = target === undefined
    ? [...profile.mappings, bindMapping({ mapping: { action, binding, icon: null }, binding, vid, pid })]
    : profile.mappings.map((mapping, index) => (index === target ? bindMapping({ mapping, binding, vid, pid }) : mapping));
  return { ...profile, mappings, modifiedAt: Date.now() };
};

export { bindProfileSlot };
