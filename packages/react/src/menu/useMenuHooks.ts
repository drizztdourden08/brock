/* @layer renderer-shell @kind hook */
import { useMemo } from 'react';
import type { Text } from '@drizztdourden08/brock-core/i18n';
import { useText } from '../i18n';
import type { MenuEntry, MenuEntryDef } from './menu.type';

const callDisabledHooks = (entries: readonly MenuEntryDef[], found: boolean[]): void => {
  for (const entry of entries) {
    if (entry === 'separator') continue;
    if (entry.useDisabled) found.push(entry.useDisabled());
    if (entry.children) callDisabledHooks(entry.children, found);
  }
};

const resolveEntries = (entries: readonly MenuEntryDef[], flags: readonly boolean[], cursor: { at: number }, text: (value: Text) => string): MenuEntry[] =>
  entries.map((entry): MenuEntry => {
    if (entry === 'separator') return entry;
    const live = entry.useDisabled ? flags[cursor.at++] === true : false;
    const { description, children: given, ...rest } = entry;
    const children = given && resolveEntries(given, flags, cursor, text);
    return {
      ...rest,
      label: text(entry.label),
      ...(description === undefined ? {} : { description: text(description) }),
      disabled: entry.disabled === true || live,
      ...(children ? { children } : {}),
    };
  });

const useMenuHooks = (entries: readonly MenuEntryDef[]): MenuEntry[] => {
  const text = useText();
  const found: boolean[] = [];
  callDisabledHooks(entries, found);
  const key = found.map((flag) => (flag ? '1' : '0')).join('');
  return useMemo(() => resolveEntries(entries, [...key].map((flag) => flag === '1'), { at: 0 }, text), [entries, key, text]);
};

export { useMenuHooks };
