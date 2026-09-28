/* @layer renderer-shell @kind types */
import type { SettingLockCause, SettingsControlProps } from '../../../settings.type';
import type { ResolvedSection } from '../../SettingsLayout.type';

interface SettingsSectionsProps<S extends object> extends SettingsControlProps<S> {
  sections: ResolvedSection[];
  lockOf: (key: string) => SettingLockCause | null;
}

export type { SettingsSectionsProps };
