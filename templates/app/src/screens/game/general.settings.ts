/* @layer renderer-app @kind config */
import type { ScreenMeta, Section } from '@drizztdourden08/brock-react';

const meta: ScreenMeta = { title: 'General', icon: 'settings', order: 1 };

const windowModes = [
  { value: 'windowed', label: 'Windowed', hint: 'A normal window you can move and resize.' },
  { value: 'borderless', label: 'Borderless', hint: 'Fills the screen without a frame, and other windows can still go on top.' },
  { value: 'fullscreen', label: 'Fullscreen', hint: 'Takes over the display until you leave fullscreen.' },
];

const asPercent = (value: number): string => `${Math.round(value * 100)}%`;

const sections: Section[] = [
  {
    id: 'window',
    title: 'Window',
    items: [
      {
        key: 'windowMode',
        label: 'Window mode',
        description: 'Windowed, borderless or fullscreen.',
        hint: 'Pick how the window sits on the screen. It changes right away.',
        control: { kind: 'choice', options: windowModes },
      },
      {
        key: 'startFullscreen',
        label: 'Start fullscreen',
        description: 'Open in fullscreen on launch.',
        hint: 'On, the app opens fullscreen the next time it starts. The window you have now stays as it is.',
      },
    ],
  },
  {
    id: 'audio',
    title: 'Audio',
    items: [
      { key: 'enableAudio', label: 'Audio', description: 'Play sound.', hint: 'Off mutes every sound the app plays, whatever the volume.' },
      {
        key: 'masterVolume',
        label: 'Master volume',
        description: 'Overall output level.',
        hint: 'Drag to scale every sound at once. 100% plays them as made.',
        control: { kind: 'range', min: 0, max: 1, step: 0.05, format: asPercent },
      },
    ],
  },
  {
    id: 'developer',
    title: 'Developer',
    items: [
      {
        key: 'developerToolsEnabled',
        label: 'Developer tools',
        description: 'Allow opening the developer tools.',
        hint: 'On, the menu shows the developer entries and the shortcut opens the browser developer tools.',
      },
      {
        key: 'allowDebugLogging',
        label: 'Debug logging',
        description: 'Write debug lines to the session log.',
        hint: 'On, the session log keeps the detailed lines that help when you report a bug. The log grows faster.',
      },
    ],
  },
];

export default sections;
export { meta };
