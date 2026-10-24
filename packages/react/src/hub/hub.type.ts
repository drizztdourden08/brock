/* @layer renderer-shell @kind types */
import type { ReactNode } from 'react';
import type { Profile } from '@drizztdourden08/brock-core';
import type { IconName } from '@drizztdourden08/tessera/primitives';
import type { ScreenParams } from '../navigation/navigation.type';
import type { HubNavMode, HubPagesMode, PageBackdrop, PageHeaderMode, ScreenMenu, ScreenMeta } from '../screens/conventions/screens-config.type';
import type { ShowRule } from '../screens/show/show.type';

interface HubTarget {
  hub?: string;
  section?: string;
  tab?: string;
}

interface HubRenderContext {
  hub: HubDef;
  page: HubPage;
  tab: HubTab | null;
  sub: HubSubPage | null;
  subParams: Record<string, string>;
  params: ScreenParams;
  open: (target: HubTarget) => void;
  close: () => void;
  profile: Profile | null;
}

interface HubTab {
  id: string;
  label: string;
  render: (ctx: HubRenderContext) => ReactNode;
  preload?: () => Promise<unknown>;
}

interface HubSubPage {
  id: string;
  label: string;
  icon: ReactNode;
  path: string;
  header?: HubPageHeader;
  fill?: boolean;
  render: (ctx: HubRenderContext) => ReactNode;
  preload?: () => Promise<unknown>;
}

interface HubPrimaryAction {
  label: string;
  icon?: ReactNode;
  open: string;
}

interface HubPageHeader {
  primary?: HubPrimaryAction;
  search?: { placeholder?: string };
}

type LiveBadge = 'ok' | 'warn';

interface LivePage {
  key: string;
  title: string;
  icon?: IconName;
  badge?: LiveBadge;
  bare?: boolean;
  showHeader?: PageHeaderMode;
  render: (ctx: HubRenderContext) => ReactNode;
}

interface LiveMeta extends Pick<ScreenMeta, 'title' | 'order' | 'keywords' | 'devOnly' | 'bare' | 'showHeader'> {
  icon: IconName;
  empty: string;
}

type UseLivePages = () => readonly LivePage[];

interface HubLiveSource {
  usePages: UseLivePages;
  meta: LiveMeta;
}

interface HubLiveRef {
  source: string;
  key: string;
}

type HubLiveLists = Readonly<Record<string, readonly LivePage[]>>;

interface HubPage {
  id: string;
  label: string;
  icon: ReactNode;
  fullBleed?: boolean;
  fill?: boolean;
  bare?: boolean;
  showHeader?: PageHeaderMode;
  tabs?: HubTab[];
  render: (ctx: HubRenderContext) => ReactNode;
  preload?: () => Promise<unknown>;
  devOnly?: boolean;
  shortcut?: string;
  settingsTab?: string;
  subs?: HubSubPage[];
  header?: HubPageHeader;
  menu?: ScreenMenu;
  order?: number;
  menuOrder?: number;
  show?: ShowRule;
  keepMounted?: boolean;
  backdrop?: PageBackdrop;
  live?: HubLiveSource;
  liveRef?: HubLiveRef;
  badge?: ReactNode;
  disabled?: boolean;
  keywords?: readonly string[];
}

interface HubGroup {
  id: string;
  label: string;
  pages: HubPage[];
}

interface HubSearchHit {
  id: string;
  label: string;
  section: string;
  tab?: string;
  detail?: string;
}

interface HubSearch {
  placeholder?: string;
  index?: (query: string) => HubSearchHit[];
}

interface HubDef {
  id: string;
  title: string;
  home: HubPage;
  groups: HubGroup[];
  search?: HubSearch;
  icon: ReactNode;
  shortcut?: string;
  show?: ShowRule;
  nav?: HubNavMode;
  pages?: HubPagesMode;
  backdrop?: PageBackdrop;
  requiresProfile?: boolean;
}

export type { HubDef, HubGroup, HubLiveLists, HubLiveSource, HubPage, HubPageHeader, HubPrimaryAction, HubRenderContext, HubSearch, HubSearchHit, HubSubPage, HubTab, HubTarget, LiveBadge, LiveMeta, LivePage, UseLivePages };
