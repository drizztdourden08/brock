/* @layer renderer-shell @kind types */
import type { IconName } from '@drizztdourden08/tessera/primitives';

type MenuPlacement = 'entry' | 'submenu' | 'hidden';

type ScreenMenu = false | 'entry' | (string & {});

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

interface BucketDef {
  id: string;
  title: string;
  icon: IconName;
  menu: MenuPlacement;
  groups?: BucketGroupDef[];
  shortcut?: string;
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

interface ScreenMeta {
  title?: string;
  icon?: IconName;
  order?: number;
  shortcut?: string;
  devOnly?: boolean;
  requiresProfile?: boolean;
  keywords?: string[];
  menu?: ScreenMenu;
  header?: PageHeaderMeta;
  path?: string;
}

export type { BucketDef, BucketGroupDef, MenuPlacement, PageHeaderMeta, PagePrimaryAction, ScreenMenu, ScreenMeta, ScreensConfig, SettingsPlacement };
