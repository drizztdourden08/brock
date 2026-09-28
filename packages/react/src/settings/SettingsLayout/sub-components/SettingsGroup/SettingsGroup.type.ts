/* @layer renderer-shell @kind types */
import type { ReactNode } from 'react';
import type { LockOverlayProps, SettingItem, SettingLockCause } from '../../../settings.type';
import type { ItemGroup } from '../../SettingsLayout.type';

interface SettingsGroupProps {
  group: ItemGroup;
  lockOf: (key: string) => SettingLockCause | null;
  lockOverlay: (props: LockOverlayProps) => ReactNode;
  renderRow: (item: SettingItem) => ReactNode;
}

export type { SettingsGroupProps };
