/* @layer renderer-shell @kind logic */
import type { MenuEntry } from './menu.type';

const withPreload = (entries: readonly MenuEntry[], preload: (route: string) => void): MenuEntry[] =>
  entries.map((entry): MenuEntry => {
    if (entry === 'separator') return entry;
    const { screen, children } = entry;
    return {
      ...entry,
      ...(screen === undefined ? {} : { onHighlight: () => preload(screen) }),
      ...(children ? { children: withPreload(children, preload) } : {}),
    };
  });

export { withPreload };
