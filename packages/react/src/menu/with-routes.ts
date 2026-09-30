/* @layer renderer-shell @kind logic */
import { joinRoute } from '../navigation/join-route';
import type { MenuEntry, MenuItem } from './menu.type';

const routed = (item: MenuItem): MenuItem => {
  const { bucket, page, tab, children, ...rest } = item;
  const screen = rest.screen ?? (bucket === undefined ? undefined : joinRoute(bucket, page, tab));
  return { ...rest, ...(screen === undefined ? {} : { screen }), ...(children ? { children: withRoutes(children) } : {}) };
};

const withRoutes = (entries: readonly MenuEntry[]): MenuEntry[] =>
  entries.map((entry) => (entry === 'separator' ? entry : routed(entry)));

export { withRoutes };
