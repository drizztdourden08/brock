/* @layer renderer-shell @kind types */
import type { ReactNode } from 'react';
import type { Profile } from '@drizztdourden08/brock-core';

interface HubTarget {
  hub?: string;
  section?: string;
  tab?: string;
}

interface HubRenderContext {
  hub: HubDef;
  page: HubPage;
  tab: HubTab | null;
  open: (target: HubTarget) => void;
  close: () => void;
  profile: Profile | null;
}

interface HubTab {
  id: string;
  label: string;
  render: (ctx: HubRenderContext) => ReactNode;
}

interface HubPage {
  id: string;
  label: string;
  icon?: ReactNode;
  tabs?: HubTab[];
  render: (ctx: HubRenderContext) => ReactNode;
  devOnly?: boolean;
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
  icon?: ReactNode;
  shortcut?: string;
}

export type { HubDef, HubGroup, HubPage, HubRenderContext, HubSearch, HubSearchHit, HubTab, HubTarget };
