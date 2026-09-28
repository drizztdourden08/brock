/* @layer renderer-shell @kind types */
import type { SettingsControlProps, TabDef } from '../../../settings.type';
import type { SettingsPageContextValue } from '../../../SettingsLayout/SettingsLayout.type';

interface HubContentProps<S extends object> extends SettingsControlProps<S> {
  searching: boolean;
  query: string;
  tabs: TabDef<S>[];
  active: TabDef<S> | null;
  pageContext: SettingsPageContextValue | null;
  onOpenTab: (id: string) => void;
}

export type { HubContentProps };
