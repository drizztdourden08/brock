/* @layer renderer-shell @kind logic */
import type { Text } from '@drizztdourden08/brock-core/i18n';
import { fallbackText } from '../i18n/fallback-text';
import { PROFILE_FIRST } from './menu.constants';
import type { MenuEntry } from './menu.type';

const lockProfileEntries = (entries: readonly MenuEntry[], locked: (route: string) => boolean, text: (value: Text) => string = fallbackText): MenuEntry[] =>
  entries.map((entry): MenuEntry => {
    if (entry === 'separator') return entry;
    const children = entry.children && lockProfileEntries(entry.children, locked, text);
    const lock = entry.disabled !== true && entry.screen !== undefined && locked(entry.screen);
    return {
      ...entry,
      ...(children ? { children } : {}),
      ...(lock ? { disabled: true, description: entry.description ?? text(PROFILE_FIRST) } : {}),
    };
  });

export { lockProfileEntries };
