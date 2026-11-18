/* @layer renderer-shell @kind logic */
import type { Text } from '@drizztdourden08/brock-core/i18n';
import type { MenuEntry, MenuEntryDef } from './menu.type';

const resolveMenuEntries = (entries: readonly MenuEntryDef[], flags: readonly boolean[], cursor: { at: number }, text: (value: Text) => string): MenuEntry[] =>
  entries.map((entry): MenuEntry => {
    if (entry === 'separator') return entry;
    const live = entry.useDisabled ? flags[cursor.at++] === true : false;
    const { description, children: given, ...rest } = entry;
    const children = given && resolveMenuEntries(given, flags, cursor, text);
    return {
      ...rest,
      label: text(entry.label),
      ...(description === undefined ? {} : { description: text(description) }),
      ...(entry.disabled === true || live ? { disabled: true } : {}),
      ...(children ? { children } : {}),
    };
  });

export { resolveMenuEntries };
