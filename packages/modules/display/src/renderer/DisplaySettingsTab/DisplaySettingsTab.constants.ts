/* @layer renderer-shell @kind constants */
import type { SettingsOption } from '@drizztdourden08/tessera/composites';
import type { SelectOption } from '@drizztdourden08/tessera/primitives';
import type { DisplayRowCopy, DisplayRowId, DisplaySectionCopy, DisplaySectionId } from './DisplaySettingsTab.type';

const WINDOW_MODE_OPTIONS: SettingsOption[] = [
  { value: 'windowed', label: 'Windowed', hint: 'A normal window with a frame, which you can move and resize.' },
  { value: 'borderless', label: 'Borderless', hint: 'Fills the screen with no frame. Other windows can still come on top.' },
  { value: 'fullscreen', label: 'Fullscreen', hint: 'Takes over the screen until you leave fullscreen.' },
];

const FOLLOW_WINDOW_OPTION: SelectOption = { value: '', label: 'The screen the window is on' };

const SYNCED_DESCRIPTION = 'Switch the display to the target rate while in fullscreen, and back when fullscreen ends.';

const DISPLAY_SECTION_COPY: Record<DisplaySectionId, DisplaySectionCopy> = {
  window: { title: 'Window', description: 'How the window fills the screen, and which screen it uses.' },
  refreshRate: { title: 'Refresh rate', description: 'A multiple of 60 shows every frame of 60 Hz content for the same time.' },
};

const DISPLAY_ROW_COPY: Record<DisplayRowId, DisplayRowCopy> = {
  windowMode: {
    label: 'Window mode',
    description: 'Windowed, borderless or fullscreen.',
    hint: 'Pick how the window fills the screen. It changes right away.',
    keywords: 'windowed borderless fullscreen full screen frame',
  },
  displayMonitor: {
    label: 'Screen',
    description: 'The screen the window uses.',
    hint: 'Pick a screen for borderless and fullscreen, or follow the screen the window is on.',
    keywords: 'monitor display output',
  },
  detectedRate: {
    label: 'Detected now',
    description: 'The rate the display runs at now.',
    hint: 'Measured from how fast the app draws frames, so it can read a little off the rate the display reports.',
    keywords: 'refresh rate hz fps frame rate',
  },
  syncedRateInFullscreen: {
    label: 'Synced rate in fullscreen',
    description: SYNCED_DESCRIPTION,
    hint: 'On, fullscreen borrows the target rate and hands the old rate back when it ends. The desktop keeps its own rate.',
    keywords: 'refresh rate hz fullscreen sync vsync',
  },
  syncedRateTargetHz: {
    label: 'Target refresh rate',
    description: 'The rate the synced mode and the change button use.',
    hint: 'Pick a rate the display offers. A multiple of 60 suits content made at 60 frames a second.',
    keywords: 'refresh rate hz 60 120 144 stutter',
  },
  changeRate: {
    label: 'Change refresh rate',
    description: 'Set the display to the target rate now and leave it there.',
    hint: 'Asks first. The screen goes black for a second while it switches, and the rate stays after the app closes.',
    keywords: 'refresh rate hz switch apply',
  },
};

export { WINDOW_MODE_OPTIONS, FOLLOW_WINDOW_OPTION, SYNCED_DESCRIPTION, DISPLAY_SECTION_COPY, DISPLAY_ROW_COPY };
