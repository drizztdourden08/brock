/* @layer renderer-shell @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'The profile form part that joins an Archipelia lobby: it browses the lobbies, checks the chosen one and reports the check to the form.',
  useWhen: [
    'The profile wizard step where a player picks the Archipelia lobby to join.',
  ],
  propsHash: '0000000000000000',
  avoidWhen: [
    { case: 'A plain Archipelago server with host, port and password.', use: 'Field' },
  ],
  rules: [
    'Pass value, the lobby form, and onChange, which gets the part that changed.',
    'The part writes the lobby check into the form on its own.',
    'Set joining while a join is running so the inputs lock.',
  ],
  a11y: [
    'It shows LobbySetup, so every input has a label.',
  ],
  tree: { path: ['a value the user sets', 'a whole record', 'edit it in place'], rule: 'The Archipelia lobby a profile joins.' },
  example: `import { ArchipeliaFields } from './ArchipeliaFields';

import type { ComponentProps } from 'react';

const Mounted = (props: ComponentProps<typeof ArchipeliaFields>) => <ArchipeliaFields {...props} />;
`,
} satisfies ComponentUsage;

export { usage };
