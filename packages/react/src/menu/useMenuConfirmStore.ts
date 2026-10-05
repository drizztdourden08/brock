/* @layer renderer-shell @kind hook */
import { create } from 'zustand';
import { CONFIRM_ARMED_MS } from './menu.constants';
import type { MenuConfirmState } from './menu.type';

let timer: ReturnType<typeof setTimeout> | null = null;

const stopTimer = (): void => {
  if (timer !== null) clearTimeout(timer);
  timer = null;
};

const useMenuConfirmStore = create<MenuConfirmState>()((set) => ({
  armed: null,
  arm: (key) => {
    stopTimer();
    timer = setTimeout(() => set({ armed: null }), CONFIRM_ARMED_MS);
    set({ armed: key });
  },
  disarm: () => {
    stopTimer();
    set({ armed: null });
  },
}));

export { useMenuConfirmStore };
