/* @layer renderer-shell @kind logic */
import type { HubDef, HubPage, HubSubPage } from '../../hub.type';

const isBarePage = (hub: Pick<HubDef, 'pages'>, page: HubPage, sub: HubSubPage | null = null): boolean =>
  sub === null
  && page.fullBleed !== true
  && page.settingsTab === undefined
  && (page.tabs === undefined || page.tabs.length === 0)
  && (page.bare ?? hub.pages === 'bare');

export { isBarePage };
