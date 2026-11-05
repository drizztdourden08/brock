/* @layer renderer-shell @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'A banner over the game picture that names the place the player just entered, then fades by itself.',
  propsHash: '0000000000000000',
  useWhen: ['The game knows where the player is and wants the place name to show when it changes.'],
  avoidWhen: [{ case: 'A message the player must read or answer.', use: 'Toast' }],
  rules: [
    'Pass location, the current place in any shape, and locationNameOf, which returns its name or null for none.',
    'The banner shows only when the name changes; a null name shows nothing.',
    'Pass dismissMs to change how long it stays.',
  ],
  a11y: ['It is a polite live region, so a screen reader hears each new place name.'],
  example: `import { LocationBanner } from '@drizztdourden08/brock-port-kit/renderer';

const nameOf = (area: number): string | null => (area > 0 ? 'Area ' + area : null);

const Mounted = ({ area }: { area: number }) => <LocationBanner location={area} locationNameOf={nameOf} />;
`,
  buildingBlock: true,
} satisfies ComponentUsage;

export { usage };
