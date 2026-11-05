/* @layer renderer-shell @kind logic */
import type { BannerEntry, LocationBannerStore } from '../LocationBanner.type';

const createLocationBannerStore = (dismissMs: number): LocationBannerStore => {
  let current: BannerEntry | null = null;
  let lastName: string | null = null;
  let stamp = 0;
  let timer: ReturnType<typeof setTimeout> | null = null;
  const listeners = new Set<() => void>();

  const set = (next: BannerEntry | null): void => {
    current = next;
    for (const listener of listeners) listener();
  };

  const stopTimer = (): void => {
    if (timer) clearTimeout(timer);
    timer = null;
  };

  const announce = (name: string | null): void => {
    if (name === lastName) return;
    lastName = name;
    if (name === null) return;
    stamp += 1;
    set({ name, stamp });
    stopTimer();
    timer = setTimeout(() => set(null), dismissMs);
  };

  const subscribe = (listener: () => void): (() => void) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  };

  return { get: () => current, announce, subscribe, dispose: stopTimer };
};

export { createLocationBannerStore };
