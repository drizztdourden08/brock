/* @layer renderer-shell @kind logic */
import type { TitleBarVolumeActionDef } from './title-bar-action.type';
import { VOLUME_RANGE } from './title-bar.constants';
import type { TitleBarVolumeSpec } from './title-bar-item.type';

const volumeBarAction = (id: string, spec: TitleBarVolumeSpec): TitleBarVolumeActionDef => {
  const { label, value, muted, onChange, onMuteToggle, shortcut } = spec;
  return {
    id,
    label,
    bar: 'volume',
    value,
    muted,
    onChange,
    onMutedChange: (next) => {
      if (next !== muted) onMuteToggle();
    },
    ...VOLUME_RANGE,
    shortcut,
  };
};

export { volumeBarAction };
