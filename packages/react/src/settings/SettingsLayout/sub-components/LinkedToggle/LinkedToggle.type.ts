/* @layer renderer-shell @kind types */
import type { SettingItem } from '../../../settings.type';

interface LinkedToggleProps {
  item: SettingItem;
  checked: boolean;
  disabled: boolean;
  onChange: (checked: boolean) => void;
}

export type { LinkedToggleProps };
