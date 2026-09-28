/* @layer renderer-shell @kind types */
import type { SettingsControlProps, TabDef } from '../../../settings.type';

interface HubSearchResultsProps<S extends object> extends SettingsControlProps<S> {
  tabs: readonly TabDef<S>[];
  query: string;
  onOpenTab: (id: string) => void;
}

export type { HubSearchResultsProps };
