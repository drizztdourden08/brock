/* @layer renderer-shell @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'The frame of a cheats widget: a tab bar over a scrolling body, where the game supplies each tab and its content.',
  useWhen: ['As the body of a game cheats widget, with one tab per area such as the player, the items or the rules.'],
  avoidWhen: [{ case: 'Tabs of a settings screen.', use: 'Tabs' }],
  rules: [
    'Pass tabs as id, label and content; the frame shows the content of the active tab only.',
    'Leave activeTab out to let the frame keep the tab, or pass activeTab and onTabChange to store it yourself, in a widget pref for example.',
    'An unknown activeTab falls back to the first tab.',
    'Pointer hints work in every tab: use usePointerHintTarget inside the content.',
  ],
  a11y: ['The tab bar is a keyboard-reachable tab list; the game labels the controls in each tab.'],
  buildingBlock: true,
  example: `import { CheatsFrame } from '@drizztdourden08/brock-react';

const Mounted = () => <CheatsFrame tabs={[{ id: 'player', label: 'Player', content: <p>Hearts</p> }]} />;
`,
} satisfies ComponentUsage;

export { usage };
