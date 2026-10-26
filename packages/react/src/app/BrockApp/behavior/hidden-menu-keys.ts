/* @layer renderer-shell @kind logic */
import type { MenuConfig } from '../../../menu/menu-config.type';
import { HOME_ENTRY, PROFILES_ENTRY } from '../BrockApp.constants';

const hiddenMenuKeys = (config: MenuConfig | undefined): ReadonlySet<string> =>
  new Set([...(config?.home === false ? [HOME_ENTRY.key] : []), ...(config?.profiles === false ? [PROFILES_ENTRY.key] : [])]);

export { hiddenMenuKeys };
