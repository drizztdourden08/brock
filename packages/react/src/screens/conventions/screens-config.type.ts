/* @layer renderer-shell @kind types */
import type { ReactNode } from 'react';
import type { ProductMenuEntry } from '@drizztdourden08/brock-core';
import type { HeroSize } from '@drizztdourden08/tessera/composites';
import type { IconName, Backdrop } from '@drizztdourden08/tessera/primitives';
import type { SettingsPreviewPlacement, SettingsValueSource } from '../../settings/settings.type';
import type { HubHeaderDef } from '../../hub/hub.type';
import type { ShowRule } from '../show/show.type';

type MenuPlacement = 'entry' | 'submenu' | 'hidden';

type HubNavMode = 'auto' | 'always' | 'rail' | false;

type HubPagesMode = 'framed' | 'bare';

type PageHeaderMode = boolean | 'compact';

type PageBackdrop = Backdrop | { kind: 'none' };

type ScreenMenu = false | 'entry' | (string & {}) | ProductMenuEntry;

type ScreenSize = 'fill' | 'info';

interface PagePrimaryAction {
  label: string;
  icon?: IconName;
  open: string;
}

interface PageHeaderMeta {
  primary?: PagePrimaryAction;
  search?: { placeholder?: string };
}

interface BucketGroupDef {
  id: string;
  label: string;
}

interface BucketDef extends ShowRule {
  id: string;
  title: string;
  icon: IconName;
  menu: MenuPlacement;
  switcher?: boolean;
  groups?: BucketGroupDef[];
  shortcut?: string;
  nav?: HubNavMode;
  pages?: HubPagesMode;
  backdrop?: PageBackdrop;
  requiresProfile?: boolean;
  top?: string[];
  header?: HubHeaderDef;
  params?: string[];
}

interface SettingsPlacement {
  bucket: string;
  page?: string;
}

interface ScreensConfig {
  buckets: BucketDef[];
  home: string;
  settings?: SettingsPlacement;
  aliases?: Record<string, string>;
}

interface HeroMeta {
  size?: HeroSize;
}

interface ScreenSearchRow {
  label: string;
  keywords?: string[];
  anchor?: string;
}

interface ScreenMeta extends ShowRule {
  title?: string;
  icon?: IconName;
  order?: number;
  menuOrder?: number;
  shortcut?: string;
  devOnly?: boolean;
  requiresProfile?: boolean;
  keywords?: string[];
  searchRows?: ScreenSearchRow[];
  menu?: ScreenMenu;
  header?: PageHeaderMeta;
  path?: string;
  fill?: boolean;
  bare?: boolean;
  showHeader?: PageHeaderMode;
  keepMounted?: boolean;
  backdrop?: PageBackdrop;
  size?: ScreenSize;
  hero?: HeroMeta;
  source?: SettingsValueSource;
  preview?: (settings: object) => ReactNode;
  previewPlacement?: SettingsPreviewPlacement;
  previewLabel?: string;
}

export type { BucketDef, BucketGroupDef, HeroMeta, HubNavMode, HubPagesMode, MenuPlacement, PageBackdrop, PageHeaderMeta, PageHeaderMode, PagePrimaryAction, ScreenMenu, ScreenMeta, ScreenSearchRow, ScreenSize, ScreensConfig, SettingsPlacement };
