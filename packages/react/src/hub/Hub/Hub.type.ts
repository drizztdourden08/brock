/* @layer renderer-shell @kind types */
import type { ScreenRenderContext } from '../../screens/screen.type';
import type { HubDef, HubGroup, HubPage, HubRenderContext, HubTab } from '../hub.type';

interface HubProps {
  def: HubDef;
  ctx: ScreenRenderContext;
}

interface HubPageList {
  groups: HubGroup[];
  pages: HubPage[];
}

interface HubSelection {
  page: HubPage;
  tab: HubTab | null;
}

interface HubState extends HubPageList, HubSelection {
  context: HubRenderContext;
  selectPage: (id: string) => void;
  selectTab: (id: string) => void;
}

export type { HubPageList, HubProps, HubSelection, HubState };
