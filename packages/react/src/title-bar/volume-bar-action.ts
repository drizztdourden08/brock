/* @layer renderer-shell @kind logic */
import type { WindowTitleBarVolumeAction } from '@drizztdourden08/tessera/composites';
import { VOLUME_RANGE } from './title-bar.constants';
import type { TitleBarVolumeSpec } from './title-bar-item.type';

const volumeBarAction = (id: string, spec: TitleBarVolumeSpec): WindowTitleBarVolumeAction => {
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
