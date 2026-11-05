/* @layer renderer-shell @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'The connection step body of a game whose online mode joins an Archipelia lobby: where the lobby is, its code and the name to join as.',
  useWhen: ['As the views.connection entry of the mode that joins through an Archipelia lobby.'],
  propsHash: 'a24f4b9662dd5e10',
  avoidWhen: [{ case: 'A plain Archipelago server with host, port and password.', use: 'Field' }],
  rules: [
    'Register it under views.connection for the mode id; the wizard hands it the connection values and a patch callback.',
    'It keeps the lobby draft and the last lobby check in the connection values, under lobby and lobbyCheck.',
    'Build the saved connection fields from the draft with lobbyConnectionFieldsOf.',
  ],
  a11y: ['Each input has a label, and each slot of the code and the address has its own name.'],
  tree: { path: ['a value the user sets', 'a whole record', 'edit it in place'], rule: 'The Archipelia lobby a profile joins.' },
  example: `import { ArchipeliaConnection } from '@drizztdourden08/brock-randomizer/renderer';

const views = { connection: { archipelia: ArchipeliaConnection } };
`,
} satisfies ComponentUsage;

export { usage };
