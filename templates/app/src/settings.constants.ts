/* @layer renderer-app @kind constants */
import { DEFAULT_BASE_SETTINGS } from '@drizztdourden08/brock-core';
import type { Section, TabDef } from '@drizztdourden08/brock-react';
import type { AppSettings } from './settings.type';

const DEFAULT_SETTINGS: AppSettings = { ...DEFAULT_BASE_SETTINGS };

const BASE_SECTIONS: Section[] = [
  {
    id: 'window',
    title: 'Window',
    items: [
      { key: 'windowMode', label: 'Window mode', description: 'Windowed, borderless or fullscreen.' },
      { key: 'startFullscreen', label: 'Start fullscreen', description: 'Open in fullscreen on launch.' },
    ],
  },
  {
    id: 'audio',
    title: 'Audio',
    items: [
      { key: 'enableAudio', label: 'Audio', description: 'Play sound.' },
      { key: 'masterVolume', label: 'Master volume', description: 'Overall output level.' },
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

const SETTINGS_TABS: TabDef<AppSettings>[] = [
  { id: 'general', label: 'General', navIcon: 'G', group: 'App', sections: () => BASE_SECTIONS },
];

export { DEFAULT_SETTINGS, SETTINGS_TABS };
