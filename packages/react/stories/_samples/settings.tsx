/* @layer stories @kind logic */
import { Icon } from '@drizztdourden08/tessera/primitives';
import type { Section, TabDef } from '../../src';

interface SampleSettings {
  startFullscreen: boolean;
  enableAudio: boolean;
  masterVolume: number;
  developerToolsEnabled: boolean;
  allowDebugLogging: boolean;
  showTips: boolean;
}

const SAMPLE_DEFAULTS: SampleSettings = {
  startFullscreen: false,
  enableAudio: true,
  masterVolume: 0.8,
  developerToolsEnabled: false,
  allowDebugLogging: false,
  showTips: true,
};

const WINDOW_SECTION: Section = {
  id: 'window',
  title: 'Window',
  items: [
    { key: 'startFullscreen', label: 'Start fullscreen', description: 'Open the window fullscreen on launch.', hint: 'Takes effect the next time the app starts.' },
    { key: 'showTips', label: 'Show tips', description: 'Short hints on first use of a screen.', hint: 'Off hides the tips on every screen.', keywords: 'hints help' },
  ],
};

const AUDIO_SECTION: Section = {
  id: 'audio',
  title: 'Audio',
  subsections: [
    {
      id: 'output',
      title: 'Output',
      items: [{ key: 'enableAudio', label: 'Enable audio', description: 'Turn every sound on or off.', hint: 'Off mutes the app whatever the volume.' }],
    },
  ],
};

const DEVELOPER_SECTION: Section = {
  id: 'developer',
  title: 'Developer',
  items: [
    { key: 'developerToolsEnabled', label: 'Developer tools', description: 'Show the developer entries in menus.', hint: 'On adds the developer entries to the menu and the palette.' },
    { key: 'allowDebugLogging', label: 'Debug logging', description: 'Write verbose logs to the session file.', hint: 'On keeps detailed lines, so the log grows faster.' },
  ],
};

const gear = <Icon name="settings" />;

const SAMPLE_TABS: TabDef<SampleSettings>[] = [
  { id: 'general', label: 'General', navIcon: gear, group: 'App', sections: () => [WINDOW_SECTION] },
  { id: 'audio', label: 'Audio', navIcon: gear, group: 'App', sections: () => [AUDIO_SECTION] },
  { id: 'developer', label: 'Developer', navIcon: gear, group: 'Extras', sections: () => [DEVELOPER_SECTION] },
];

export { AUDIO_SECTION, DEVELOPER_SECTION, SAMPLE_DEFAULTS, SAMPLE_TABS, WINDOW_SECTION, gear };
export type { SampleSettings };
