/* @layer core @kind logic */
import type { PadDevice, PadExtra } from './controller-slot.type';
import { isButtonDown } from './is-button-down';
import { EXTRA_BUTTONS, EXTRA_FAMILY_LABELS } from './pad-slots.constants';

const padExtrasOf = (buttons: readonly boolean[], device?: PadDevice): PadExtra[] => {
  const present = device?.hasButton ?? [];
  const labels = EXTRA_FAMILY_LABELS[device?.family ?? 'generic'] ?? {};
  return EXTRA_BUTTONS
    .filter(([, , name]) => present.length === 0 || isButtonDown(present, name))
    .map(([id, label, name]) => ({ id, label: labels[id] ?? label, pressed: isButtonDown(buttons, name) }));
};

export { padExtrasOf };
