/* @layer renderer-shell @kind types */
import type { SettingItem } from '../../../settings.type';

interface DefaultControlProps {
  item: SettingItem;
  value: unknown;
  disabled: boolean;
  onChange: (value: unknown) => void;
}

export type { DefaultControlProps };
