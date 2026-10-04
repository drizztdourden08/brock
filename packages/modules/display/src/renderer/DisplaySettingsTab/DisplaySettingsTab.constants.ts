/* @layer renderer-shell @kind constants */
import type { SettingsOption } from '@drizztdourden08/tessera/composites';
import type { SelectOption } from '@drizztdourden08/tessera/primitives';

const WINDOW_MODE_OPTIONS: SettingsOption[] = [
  { value: 'windowed', label: 'Windowed', hint: 'A normal window with a frame, which you can move and resize.' },
  { value: 'borderless', label: 'Borderless', hint: 'Fills the screen with no frame. Other windows can still come on top.' },
  { value: 'fullscreen', label: 'Fullscreen', hint: 'Takes over the screen until you leave fullscreen.' },
];

const FOLLOW_WINDOW_OPTION: SelectOption = { value: '', label: 'The screen the window is on' };

const SYNCED_DESCRIPTION = 'Switch the display to the target rate while in fullscreen, and back when fullscreen ends.';

export { WINDOW_MODE_OPTIONS, FOLLOW_WINDOW_OPTION, SYNCED_DESCRIPTION };
