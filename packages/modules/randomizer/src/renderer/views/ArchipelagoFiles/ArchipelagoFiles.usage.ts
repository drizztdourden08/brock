/* @layer renderer-shell @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'A button that saves the player file and the world package of an online profile to a folder the player picks, and says what was saved.',
  useWhen: [
    'The run page of an online randomizer profile, so the player can hand the yaml and the apworld to the room host.',
  ],
  avoidWhen: [
    { case: 'A button that only starts a download with no folder picker or result line.', use: 'Button' },
    { case: 'A card on the run page that appears only for online profiles.', use: 'ArchipelagoFilesSlot' },
  ],
  rules: [
    'Pass fileOf to build the slot name and the yaml at the moment of the click.',
    'Pass notice in the file when the yaml is partial, so the result line carries it.',
    'List the Archipelago versions the app packs in supportedVersions.',
  ],
  a11y: ['The result line is plain text under the button; an error is coloured and worded as "Not saved".'],
  example: `import { ArchipelagoFiles } from '@drizztdourden08/brock-randomizer/renderer';

const Files = () => (
  <ArchipelagoFiles
    apVersion="0.5.1"
    supportedVersions={['0.5.1']}
    moduleName="mygame"
    fileOf={() => ({ slotName: 'Player', yaml: 'name: Player' })}
  />
);
`,
  buildingBlock: true,
} satisfies ComponentUsage;

export { usage };
