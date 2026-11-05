/* @layer renderer-shell @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'A drop zone where the player drops a ROM file and the app gets its name and bytes.',
  useWhen: [
    'A game port needs the player to bring a ROM before it can start.',
  ],
  propsHash: '1a0e92634b20e3b9',
  avoidWhen: [
    { case: 'Picking any file with a folder dialog and a result line.', use: 'Button' },
    { case: 'A text input for a path or a name.', use: 'Field' },
  ],
  rules: [
    'Pass extensions, the file types the zone accepts; they also fill the hint unless hint is set.',
    'onRom receives the file name and its bytes.',
    'Set disabled while a ROM is loading.',
  ],
  a11y: [
    'The drop zone has a visible label, "Drop your ROM here" by default, and the hint under it.',
  ],
  example: `import { RomPicker } from '@drizztdourden08/brock-port-kit/renderer';

const Mounted = ({ load }: { load: (name: string, bytes: Uint8Array) => void }) => (
  <RomPicker extensions={['.sfc', '.smc']} onRom={(rom) => load(rom.name, rom.bytes)} />
);
`,
  buildingBlock: true,
} satisfies ComponentUsage;

export { usage };
