/* @layer renderer-shell @kind hook */
import { useMemo } from 'react';
import { useText } from '../i18n';
import type { MenuEntry, MenuEntryDef } from './menu.type';
import { resolveMenuEntries } from './resolve-menu-entries';

const callDisabledHooks = (entries: readonly MenuEntryDef[], found: boolean[]): void => {
  for (const entry of entries) {
    if (entry === 'separator') continue;
    if (entry.useDisabled) found.push(entry.useDisabled());
    if (entry.children) callDisabledHooks(entry.children, found);
  }
};

const useMenuHooks = (entries: readonly MenuEntryDef[]): MenuEntry[] => {
  const text = useText();
  const found: boolean[] = [];
  callDisabledHooks(entries, found);
  const key = found.map((flag) => (flag ? '1' : '0')).join('');
  return useMemo(() => resolveMenuEntries(entries, [...key].map((flag) => flag === '1'), { at: 0 }, text), [entries, key, text]);
};

export { useMenuHooks };
