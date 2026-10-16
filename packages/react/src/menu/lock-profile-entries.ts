/* @layer renderer-shell @kind logic */
import { PROFILE_FIRST } from './menu.constants';
import type { MenuEntry } from './menu.type';

const lockProfileEntries = (entries: readonly MenuEntry[], locked: (route: string) => boolean): MenuEntry[] =>
  entries.map((entry): MenuEntry => {
    if (entry === 'separator') return entry;
    const children = entry.children && lockProfileEntries(entry.children, locked);
    const lock = entry.disabled !== true && entry.screen !== undefined && locked(entry.screen);
    return {
      ...entry,
      ...(children ? { children } : {}),
      ...(lock ? { disabled: true, description: entry.description ?? PROFILE_FIRST } : {}),
    };
  });

export { lockProfileEntries };
