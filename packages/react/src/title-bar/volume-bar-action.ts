/* @layer renderer-shell @kind logic */
import type { WindowTitleBarCommandAction } from '@drizztdourden08/tessera/composites';
import type { IconName } from '@drizztdourden08/tessera/primitives';
import { VOLUME_STRINGS, VOLUME_WAVE_STEP } from './title-bar.constants';
import type { TitleBarVolumeSpec } from './title-bar-item.type';

const silentOf = (spec: TitleBarVolumeSpec): boolean => spec.muted || spec.value <= 0;

const volumeIcon = (spec: TitleBarVolumeSpec): IconName => {
  if (silentOf(spec)) return 'volume-x';
  return spec.value < VOLUME_WAVE_STEP ? 'volume-1' : 'volume-2';
};

const volumeBarAction = (id: string, spec: TitleBarVolumeSpec): WindowTitleBarCommandAction => {
  const silent = silentOf(spec);
  const strings = spec.labels ?? VOLUME_STRINGS;
  return {
    id,
    label: silent ? strings.unmute : strings.mute,
    icon: volumeIcon(spec),
    bar: 'button',
    tone: silent ? 'danger' : 'primary',
    status: `${spec.label} ${Math.round(Math.min(1, Math.max(0, spec.value)) * 100)}%`,
    shortcut: spec.shortcut,
    onSelect: spec.onMuteToggle,
  };
};

export { volumeBarAction };
