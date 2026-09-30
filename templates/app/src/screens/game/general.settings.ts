/* @layer renderer-app @kind config */
import type { ScreenMeta, Section } from '@drizztdourden08/brock-react';

const meta: ScreenMeta = { title: 'General', icon: 'settings', order: 1 };

const windowModes = [
  { value: 'windowed', label: 'Windowed' },
  { value: 'borderless', label: 'Borderless' },
  { value: 'fullscreen', label: 'Fullscreen' },
];

const asPercent = (value: number): string => `${Math.round(value * 100)}%`;

const sections: Section[] = [
  {
    id: 'window',
    title: 'Window',
    items: [
      { key: 'windowMode', label: 'Window mode', description: 'Windowed, borderless or fullscreen.', control: { kind: 'choice', options: windowModes } },
      { key: 'startFullscreen', label: 'Start fullscreen', description: 'Open in fullscreen on launch.' },
    ],
  },
  {
    id: 'audio',
    title: 'Audio',
    items: [
      { key: 'enableAudio', label: 'Audio', description: 'Play sound.' },
      { key: 'masterVolume', label: 'Master volume', description: 'Overall output level.', control: { kind: 'range', min: 0, max: 1, step: 0.05, format: asPercent } },
    ],
  },
  {
    id: 'developer',
    title: 'Developer',
    items: [
      { key: 'developerToolsEnabled', label: 'Developer tools', description: 'Allow opening the developer tools.' },
      { key: 'allowDebugLogging', label: 'Debug logging', description: 'Write debug lines to the session log.' },
    ],
  },
];

export default sections;
export { meta };
