/* @layer renderer-app @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'The controls screen: a profiles rail, binding tabs and a devices rail, all driven by one game config.',
  useWhen: ['As the controls page of a game settings area, with a game config and a profile store.'],
  avoidWhen: [{ case: 'Only showing which buttons a pad holds right now.', use: 'PressedGrid' }],
  rules: [
    'Describe the tabs, verbs and default bindings in a ControlsGame; every visible string has an English default you can override with game.labels.',
    'Pass an InputProfileStore for the saved profiles; pass a GlobalBindingsStore only when a tab has scope global.',
    'Register button and controller glyphs with registerGlyphSource; without a source the rows show text only.',
    'Use a custom tab for anything the built-in tab kinds do not cover.',
    'Set game.extraDevices to list devices of your own beside the detected ones; they read as connected and take the same preset flow.',
    'Below 640px wide the screen shows Profiles, Bindings and Devices as tabs, one full-width panel at a time, with Bindings first; the tab names are the profilesTitle, tabBindings and devicesTitle labels.',
    'Return true from game.listenerFullscreen for a target to make the waiting-for-input popover fill the viewport, with listenerExtra taking the free space.',
    'Set game.listenerExtra to render your own content under the hint of the waiting-for-input popover.',
  ],
  a11y: ['Every binding row is a button named after its action; the listener dialog names the action being bound.'],
  buildingBlock: true,
  example: `import { ControlsSettings } from '@drizztdourden08/brock-input/renderer';
import type { ControlsGame, InputProfileStore } from '@drizztdourden08/brock-input/renderer';

const game: ControlsGame = {
  tabs: [
    {
      id: 'actions',
      label: 'Controls',
      kind: 'actions',
      scope: 'profile',
      actions: [
        { id: 'jump', label: 'Jump' },
        { id: 'attack', label: 'Attack' },
      ],
    },
    { id: 'options', label: 'Options', kind: 'options' },
  ],
  keyboardDefaults: [],
  defaultBindings: () => [],
};

const store: InputProfileStore = {
  load: async () => [],
  save: async () => undefined,
  activeId: null,
  activate: () => undefined,
};

const Mounted = () => <ControlsSettings game={game} profiles={store} />;
`,
  propsHash: '9d510fff87d21205',
} satisfies ComponentUsage;

export { usage };
