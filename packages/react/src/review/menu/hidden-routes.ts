/* @layer renderer-shell @kind logic */
import type { MenuOverrideRecord } from '../../menu/menu-config.type';

const hiddenRoutes = (records: readonly MenuOverrideRecord[]): Set<string> =>
  new Set(records.flatMap((record) => (record.override.hidden === true && record.route !== undefined ? [record.route] : [])));

export { hiddenRoutes };
