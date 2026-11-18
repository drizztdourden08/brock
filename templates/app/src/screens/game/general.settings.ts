/* @layer renderer-app @kind config */
import { msg } from '@drizztdourden08/brock-core/i18n';
import { widgets } from '@drizztdourden08/brock-react';
import type { ScreenMeta, Section } from '@drizztdourden08/brock-react';

const meta: ScreenMeta = { title: msg('app:general.title'), icon: 'settings', order: 1 };

const windowModes = [
  { value: 'windowed', label: msg('app:general.windowMode.windowed.label'), hint: msg('app:general.windowMode.windowed.hint') },
  { value: 'borderless', label: msg('app:general.windowMode.borderless.label'), hint: msg('app:general.windowMode.borderless.hint') },
  { value: 'fullscreen', label: msg('app:general.windowMode.fullscreen.label'), hint: msg('app:general.windowMode.fullscreen.hint') },
];

const asPercent = (value: number): string => `${Math.round(value * 100)}%`;

const sections: Section[] = [
  {
    id: 'window',
    title: msg('app:general.window.title'),
    items: [
      {
        key: 'windowMode',
        label: msg('app:general.windowMode.label'),
        description: msg('app:general.windowMode.description'),
        hint: msg('app:general.windowMode.hint'),
        control: { kind: 'choice', options: windowModes },
      },
      {
        key: 'startFullscreen',
        label: msg('app:general.startFullscreen.label'),
        description: msg('app:general.startFullscreen.description'),
        hint: msg('app:general.startFullscreen.hint'),
      },
      {
        key: 'widgetLayout',
        label: msg('app:general.widgetLayout.label'),
        description: msg('app:general.widgetLayout.description'),
        hint: msg('app:general.widgetLayout.hint'),
        actions: [{ id: 'reset-layout', label: msg('app:general.widgetLayout.reset'), icon: 'rotate-ccw', tone: 'danger', confirm: 'Reset the layout?', onSelect: () => widgets.reset() }],
      },
    ],
  },
  {
    id: 'audio',
    title: msg('app:general.audio.title'),
    items: [
      {
        key: 'enableAudio',
        label: msg('app:general.enableAudio.label'),
        description: msg('app:general.enableAudio.description'),
        hint: msg('app:general.enableAudio.hint'),
      },
      {
        key: 'masterVolume',
        label: msg('app:general.masterVolume.label'),
        description: msg('app:general.masterVolume.description'),
        hint: msg('app:general.masterVolume.hint'),
        control: { kind: 'range', min: 0, max: 1, step: 0.05, format: asPercent },
      },
    ],
  },
  {
    id: 'developer',
    title: msg('app:general.developer.title'),
    items: [
      {
        key: 'developerToolsEnabled',
        label: msg('app:general.developerTools.label'),
        description: msg('app:general.developerTools.description'),
        hint: msg('app:general.developerTools.hint'),
      },
      {
        key: 'allowDebugLogging',
        label: msg('app:general.debugLogging.label'),
        description: msg('app:general.debugLogging.description'),
        hint: msg('app:general.debugLogging.hint'),
      },
    ],
  },
];

export default sections;
export { meta };
