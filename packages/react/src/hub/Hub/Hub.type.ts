/* @layer renderer-shell @kind types */
import type { ScreenRenderContext } from '../../screens/screen.type';
import type { HubDef, HubGroup, HubLiveLists, HubLiveSource, HubPage, HubRenderContext, HubSubPage, HubTab } from '../hub.type';

interface HubProps {
  def: HubDef;
  ctx: ScreenRenderContext;
}

interface HubLiveEntry {
  id: string;
  source: HubLiveSource;
}

interface HubBodyProps extends HubProps {
  live: HubLiveLists;
}

interface HubPageList {
  groups: HubGroup[];
  pages: HubPage[];
  fallbacks: ReadonlyMap<string, HubPage>;
}

interface HubSelection {
  page: HubPage;
  tab: HubTab | null;
  sub: HubSubPage | null;
  subParams: Record<string, string>;
}

interface KeptPage {
  id: string;
  context: HubRenderContext;
  shown: boolean;
}

interface HubState extends HubPageList, HubSelection {
  context: HubRenderContext;
  selectPage: (id: string) => void;
  selectTab: (id: string) => void;
  up: () => void;
}

export type { HubBodyProps, HubLiveEntry, HubPageList, HubProps, HubSelection, HubState, KeptPage };
