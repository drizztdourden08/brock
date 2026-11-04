/* @layer core @kind logic */
import type { PendingBoot } from './pending-boot.type';

const slot: { value: PendingBoot | null } = { value: null };

const pendingBoot = {
  get: (): PendingBoot | null => slot.value,
  set: (next: PendingBoot): void => {
    slot.value = next;
  },
  clear: (): void => {
    slot.value = null;
  },
};

export { pendingBoot };
