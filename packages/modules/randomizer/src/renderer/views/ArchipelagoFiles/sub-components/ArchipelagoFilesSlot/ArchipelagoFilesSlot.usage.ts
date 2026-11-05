/* @layer renderer-shell @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'A run page card holding the save files button, shown only while the active profile is an online one.',
  useWhen: ['A game lists it in its run panels so online profiles can save their player file and world package.'],
  propsHash: '0000000000000000',
  avoidWhen: [
    { case: 'The button alone, placed in a card the game builds itself.', use: 'Button' },
    { case: 'A run panel that always shows, whatever the profile mode.', use: 'Card' },
  ],
  rules: [
    'Pass sourceOf to turn the active profile config into the file source.',
    'Register it in the game views as a run panel; it renders nothing for a local profile.',
  ],
  a11y: ['The card carries its title as the heading of the button group.'],
  example: `import { ArchipelagoFilesSlot } from '@drizztdourden08/brock-randomizer/renderer';

const FilesSlot = () => (
  <ArchipelagoFilesSlot
    sourceOf={() => ({
      apVersion: '0.5.1',
      supportedVersions: ['0.5.1'],
      moduleName: 'mygame',
      fileOf: () => ({ slotName: 'Player', yaml: 'name: Player' }),
    })}
  />
);
`,
  buildingBlock: true,
} satisfies ComponentUsage;

export { usage };
