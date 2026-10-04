/* @layer renderer-shell @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'The body of an About screen: the app mark or logo, its name, rows of facts, a button that copies the debug text, and legal text.',
  useWhen: [
    'The About screen of a Brock app, as the children of InfoScreen.',
    'A page or dialog that shows the version, runtime and platform with a way to copy them for a bug report.',
  ],
  avoidWhen: [
    { case: 'Facts sorted under group headings, such as the stats of a record.', use: 'FactsPanel' },
    { case: 'One label and its value on their own.', use: 'StatRow' },
    { case: 'An opening banner with art and actions.', use: 'Hero' },
  ],
  rules: [
    'Pass brand only when the product is that Tessera brand, and set heading to title when the product name is not the brand name, so the wordmark never names another app.',
    'Give logo when there is no brand; brand wins when both are set.',
    'Pass rim, the product.icons.rim, so the brand draws as its bare mark with that rim, readable on the panel surface.',
    'Keep each row a short fact with its own label: the label is the row key.',
    'Pass copyText as null while the debug text is gathered, so the button shows a spinner; leave it out to hide the button.',
    'Inside InfoScreen, put legal text in the screen footer and leave legal out.',
  ],
  a11y: [
    'The name is an h2 heading; a wordmark carries the name as its title.',
    'The logo and the mark are decorative and hidden from screen readers.',
    'The copy button reads Copied once the text is on the clipboard.',
  ],
  tree: {
    path: ['layout', 'a ready-made app panel', 'about the app'],
    rule: 'The ready-made body of the About screen.',
  },
  example: `import { InfoScreen } from '@drizztdourden08/tessera/composites';
import { Icon } from '@drizztdourden08/tessera/primitives';
import { AboutPanel } from '@drizztdourden08/brock-react';

const AboutSample = ({ onClose }: { onClose: () => void }) => (
  <InfoScreen title="About" icon={<Icon name="info" />} heading="Brock" onClose={onClose} footer="Names and marks belong to their owners.">
    <AboutPanel title="Brock" brand="brock" rows={[{ label: 'Version', value: '0.4.0' }]} copyText="Brock 0.4.0" />
  </InfoScreen>
);
`,
  propsHash: '51201793ee52fd08',
} satisfies ComponentUsage;

export { usage };
