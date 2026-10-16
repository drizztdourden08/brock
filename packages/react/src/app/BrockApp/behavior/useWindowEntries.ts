/* @layer renderer-shell @kind hook */
import { useMemo } from 'react';
import type { MenuItem } from '../../../menu/menu.type';
import { usePlatform } from '../../../platform/usePlatform';
import { togglePin } from '../../../shell/TitleBar/behavior/toggle-pin';
import { usePinStore } from '../../../shell/TitleBar/behavior/usePinStore';
import { useTitleBar } from '../../../shell/TitleBar/behavior/useTitleBar';
import { NO_WINDOW_ENTRIES, WINDOW_FULLSCREEN_ENTRY, WINDOW_PIN_ENTRY } from '../BrockApp.constants';
import { useTuckedControls } from './useTuckedControls';

const useWindowEntries = (viewHidden: boolean, barShown: boolean): readonly MenuItem[] => {
  const { window: win } = usePlatform();
  const tucked = useTuckedControls(viewHidden && barShown);
  const pinned = usePinStore((s) => s.pinned);
  const { isFullscreen } = useTitleBar();
  return useMemo(() => {
    if (!tucked.pin && !tucked.fullscreen) return NO_WINDOW_ENTRIES;
    return [
      ...(tucked.pin ? [{ ...WINDOW_PIN_ENTRY, checked: pinned, onClick: () => void togglePin(win) }] : []),
      ...(tucked.fullscreen ? [{ ...WINDOW_FULLSCREEN_ENTRY, checked: isFullscreen, onClick: () => win.toggleFullscreen() }] : []),
    ];
  }, [tucked.pin, tucked.fullscreen, pinned, isFullscreen, win]);
};

export { useWindowEntries };
