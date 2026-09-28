/* @layer renderer-shell @kind types */
import type { SettingsControlProps, TabDef } from '../../../settings.type';

interface HubTabContentProps<S extends object> extends SettingsControlProps<S> {
  tab: TabDef<S>;
}

export type { HubTabContentProps };
