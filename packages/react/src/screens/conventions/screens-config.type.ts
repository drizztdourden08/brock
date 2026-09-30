/* @layer renderer-shell @kind types */
import type { IconName } from '@drizztdourden08/tessera/primitives';

type MenuPlacement = 'entry' | 'submenu' | 'hidden';

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
}

export type { BucketDef, BucketGroupDef, MenuPlacement, ScreenMeta, ScreensConfig, SettingsPlacement };
