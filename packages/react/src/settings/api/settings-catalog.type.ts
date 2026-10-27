/* @layer renderer-shell @kind types */
import type { ScreenParams } from '../../navigation/navigation.type';
import type { SettingControlKind } from '../settings.type';

interface CatalogChoice {
  value: string;
  label: string;
  hint?: string;
  disabled: boolean;
}

interface CatalogControl {
  kind: SettingControlKind | 'toggle' | 'none';
  choices?: CatalogChoice[];
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  shape?: 'object' | 'array' | 'any';
}

interface CatalogItem {
  key: string;
  label: string;
  description?: string;
  hint?: string;
  control: CatalogControl;
  source: 'app' | 'custom';
  settable: boolean;
  visible: boolean;
  value?: unknown;
}

interface CatalogSubSection {
  id: string;
  title: string;
  items: CatalogItem[];
}

interface CatalogSection {
  id: string;
  title: string;
  items: CatalogItem[];
  subsections: CatalogSubSection[];
}

interface CatalogScreen {
  id: string;
  label: string;
  group: string;
  route: string;
  params?: ScreenParams;
  sections: CatalogSection[];
}

type SettingSetFailure = 'unknown' | 'scope' | 'invalid' | 'not-ready';

type SettingSetResult = { ok: true } | { ok: false; why: SettingSetFailure; reason: string };

export type { CatalogChoice, CatalogControl, CatalogItem, CatalogScreen, CatalogSection, CatalogSubSection, SettingSetFailure, SettingSetResult };
