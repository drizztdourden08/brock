/* @layer renderer-shell @kind logic */
import type { TabDef } from '../../settings/settings.type';
import type { CatalogInput } from '../palette.type';

const visibleTabs = (input: CatalogInput): readonly TabDef<object>[] =>
  input.settings !== null && input.hasProfile ? input.tabs.filter((tab) => tab.mobileOnly !== true || input.isMobile) : [];

export { visibleTabs };
