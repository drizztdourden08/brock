/* @layer renderer-shell @kind types */
import type { ProductMenuEntry } from '@drizztdourden08/brock-core';
import type { HeroSize } from '@drizztdourden08/tessera/composites';
import type { IconName, Backdrop } from '@drizztdourden08/tessera/primitives';
import type { SettingsValueSource } from '../../settings/settings.type';
import type { ShowRule } from '../show/show.type';

type MenuPlacement = 'entry' | 'submenu' | 'hidden';

type HubNavMode = 'auto' | 'always' | false;

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
  groups?: BucketGroupDef[];
  shortcut?: string;
  nav?: HubNavMode;
  pages?: HubPagesMode;
  backdrop?: PageBackdrop;
  requiresProfile?: boolean;
}

interface SettingsPlacement {
  bucket: string;
  page?: string;
}

interface ScreensConfig {
  buckets: BucketDef[];
  home: string;
  settings?: SettingsPlacement;
}

interface HeroMeta {
  size?: HeroSize;
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
}

export type { BucketDef, BucketGroupDef, HeroMeta, HubNavMode, HubPagesMode, MenuPlacement, PageBackdrop, PageHeaderMeta, PageHeaderMode, PagePrimaryAction, ScreenMenu, ScreenMeta, ScreenSize, ScreensConfig, SettingsPlacement };
