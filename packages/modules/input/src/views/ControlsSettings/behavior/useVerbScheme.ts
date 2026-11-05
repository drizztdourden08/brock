/* @layer renderer-components @kind hook */
import { useCallback, useMemo } from 'react';
import {
  addSlot, claimedPositions, effectiveSlots, profileWithSlots, profileWithVerbs, removeSlot, resolveVerbBindings,
  setSlotBinding,
} from '../../../bindings';
import type { BindingSlot, InputBinding, SlotListEdit, VerbBindings } from '../../../bindings';
import type { UseVerbSchemeArgs } from '../ControlsBehavior.type';
import { slotDisplayFor } from './slot-display-for';

const useVerbScheme = ({ game, activeProfile, updateActiveProfile, controls }: UseVerbSchemeArgs) => {
  const isKeyboard = activeProfile?.deviceType === 'keyboard';
  const verbs = useMemo(() => game.verbs ?? [], [game.verbs]);
  const slotsConfig = useMemo(() => {
    const tab = game.tabs.find((candidate) => candidate.kind === 'verbs');
    return tab?.kind === 'verbs' ? tab.slots : undefined;
  }, [game.tabs]);

  const storedVerbs = activeProfile?.verbs;
  const verbBindings: VerbBindings = useMemo(
    () => resolveVerbBindings(verbs, { stored: storedVerbs, controls, keyboard: isKeyboard }),
    [verbs, storedVerbs, controls, isKeyboard],
  );

  const storedSlots = activeProfile?.slots;
  const slots: BindingSlot[] = useMemo(() => effectiveSlots({
    claimed: claimedPositions(verbBindings, verbs),
    controls,
    keyboard: isKeyboard,
    stored: storedSlots,
    keyboardSlots: slotsConfig?.keyboardSlots,
  }), [verbBindings, verbs, controls, isKeyboard, storedSlots, slotsConfig]);

  const hasSlotSource = controls.length > 0 || isKeyboard || slots.length > 0;

  const applyVerbBinding = useCallback((verbId: string, binding: InputBinding) => {
    if (activeProfile) updateActiveProfile(profileWithVerbs(activeProfile, { ...verbBindings, [verbId]: binding }));
  }, [activeProfile, verbBindings, updateActiveProfile]);

  const writeSlots = useCallback((edit: SlotListEdit, renumbered: boolean) => {
    if (!activeProfile) return;
    updateActiveProfile(profileWithVerbs(profileWithSlots(activeProfile, edit.slots), verbBindings));
    if (renumbered) slotsConfig?.onRenumber?.(edit.renumber);
  }, [activeProfile, verbBindings, slotsConfig, updateActiveProfile]);

  const applySlotBinding = useCallback((slot: BindingSlot, binding: InputBinding) => {
    const next = setSlotBinding(slots, slot.index, binding, slotDisplayFor(binding, controls));
    writeSlots({ slots: next, renumber: new Map() }, false);
  }, [slots, controls, writeSlots]);

  const handleAddSlot = useCallback(() => writeSlots(addSlot(slots), false), [slots, writeSlots]);

  const handleRemoveSlot = useCallback((index: number) => writeSlots(removeSlot(slots, index), true), [slots, writeSlots]);

  return {
    verbs, verbBindings, slots, hasSlotSource, applyVerbBinding, applySlotBinding, handleAddSlot, handleRemoveSlot,
  };
};

export { useVerbScheme };
