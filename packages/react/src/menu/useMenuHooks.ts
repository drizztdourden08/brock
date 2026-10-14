/* @layer renderer-shell @kind hook */
import { useMemo } from 'react';
import type { MenuEntry } from './menu.type';

const callDisabledHooks = (entries: readonly MenuEntry[], found: boolean[]): void => {
  for (const entry of entries) {
    if (entry === 'separator') continue;
    if (entry.useDisabled) found.push(entry.useDisabled());
    if (entry.children) callDisabledHooks(entry.children, found);
  }
};

const withDisabled = (entries: readonly MenuEntry[], flags: readonly boolean[], cursor: { at: number }): MenuEntry[] =>
  entries.map((entry) => {
    if (entry === 'separator') return entry;
    const live = entry.useDisabled ? flags[cursor.at++] === true : false;
    const children = entry.children && withDisabled(entry.children, flags, cursor);
    return { ...entry, disabled: entry.disabled === true || live, ...(children ? { children } : {}) };
  });

const useMenuHooks = (entries: readonly MenuEntry[]): MenuEntry[] => {
  const found: boolean[] = [];
  callDisabledHooks(entries, found);
  const key = found.map((flag) => (flag ? '1' : '0')).join('');
  return useMemo(() => withDisabled(entries, [...key].map((flag) => flag === '1'), { at: 0 }), [entries, key]);
};

export { useMenuHooks };
