/* @layer renderer-shell @kind constants */
import type { WidgetPinMode, WidgetWindowState } from '@drizztdourden08/brock-core';
import type { SegmentOption } from '@drizztdourden08/tessera/primitives';
import type { PinChoice } from './WidgetWindow.type';

const INITIAL_WINDOW_STATE: WidgetWindowState = { pin: 'off', onTop: false, snap: true, link: null, sync: true, group: null, square: false };

const PIN_CHOICES: readonly PinChoice[] = [
  { value: 'off', label: 'Normal window', short: 'Normal', hint: 'Stacks like any other window', icon: 'pin-off' },
  { value: 'top', label: 'Always on top', short: 'On top', hint: 'Stays above every other window, even other apps', icon: 'pin' },
];

const PIN_SEGMENTS: SegmentOption<WidgetPinMode>[] = PIN_CHOICES.map((choice) => ({
  value: choice.value, label: choice.short, hint: { label: choice.label, description: choice.hint },
}));

const PIN_TEXT = {
  row: 'Stacking',
  menu: 'Window stacking',
  barTitle: (label: string): string => `Stacking: ${label}. Click to choose`,
} as const;

const TITLEBAR_ACTIONS_SELECTOR = '.widget__titlebar-actions';

export { INITIAL_WINDOW_STATE, PIN_CHOICES, PIN_SEGMENTS, PIN_TEXT, TITLEBAR_ACTIONS_SELECTOR };
