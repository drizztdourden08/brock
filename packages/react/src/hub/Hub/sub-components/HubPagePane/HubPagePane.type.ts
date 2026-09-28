/* @layer renderer-shell @kind types */
import type { HubPage, HubRenderContext, HubTab } from '../../../hub.type';

interface HubPagePaneProps {
  page: HubPage;
  tab: HubTab | null;
  context: HubRenderContext;
}

export type { HubPagePaneProps };
