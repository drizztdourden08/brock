/* @layer renderer-shell @kind constants */
import type { SegmentOption, SelectOption } from '@drizztdourden08/tessera/primitives';
import type { WindowMode } from '../../display.type';

const WINDOW_MODE_OPTIONS: SegmentOption<WindowMode>[] = [
  { value: 'windowed', label: 'Windowed' },
  { value: 'borderless', label: 'Borderless' },
  { value: 'fullscreen', label: 'Fullscreen' },
];

const FOLLOW_WINDOW_OPTION: SelectOption = { value: '', label: 'The screen the window is on' };

export { WINDOW_MODE_OPTIONS, FOLLOW_WINDOW_OPTION };
