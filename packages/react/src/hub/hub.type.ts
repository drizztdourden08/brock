/* @layer renderer-shell @kind types */
import type { ReactNode } from 'react';
import type { Profile } from '@drizztdourden08/brock-core';
import type { ScreenParams } from '../navigation/navigation.type';
import type { ScreenMenu } from '../screens/conventions/screens-config.type';

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
}

interface HubSubPage {
  id: string;
  label: string;
  icon: ReactNode;
  path: string;
  header?: HubPageHeader;
  fill?: boolean;
  render: (ctx: HubRenderContext) => ReactNode;
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

interface HubPage {
  id: string;
  label: string;
  icon: ReactNode;
  fullBleed?: boolean;
  fill?: boolean;
  tabs?: HubTab[];
  render: (ctx: HubRenderContext) => ReactNode;
  devOnly?: boolean;
  shortcut?: string;
  settingsTab?: string;
  subs?: HubSubPage[];
  header?: HubPageHeader;
  menu?: ScreenMenu;
  order?: number;
  menuOrder?: number;
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
}

export type { HubDef, HubGroup, HubPage, HubPageHeader, HubPrimaryAction, HubRenderContext, HubSearch, HubSearchHit, HubSubPage, HubTab, HubTarget };
