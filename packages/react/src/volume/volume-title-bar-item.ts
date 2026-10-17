/* @layer renderer-shell @kind logic */
import { useTesseraStrings } from '@drizztdourden08/tessera/primitives';
import type { TitleBarVolumeSpec } from '../title-bar/title-bar-item.type';
import { useVolumeStore } from './useVolumeStore';
import type { VolumeItemOptions } from './volume.type';

const volumeTitleBarItem = (options: VolumeItemOptions = {}): (() => TitleBarVolumeSpec) => {
  const useVolumeTitleBarItem = (): TitleBarVolumeSpec => {
    const { common } = useTesseraStrings();
    const { value, muted, setValue, toggleMute } = useVolumeStore();
    return {
      kind: 'volume',
      label: options.label ?? common.volume,
      value,
      muted,
      onChange: setValue,
      onMuteToggle: toggleMute,
      shortcut: options.shortcut,
    };
  };
  return useVolumeTitleBarItem;
};

export { volumeTitleBarItem };
