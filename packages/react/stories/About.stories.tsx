/* @layer stories @kind story */
import type { StoryLiteMeta, StoryLiteStoryDefinition, StoryLiteArgTypes } from '@storylite/storylite';
import { About } from '../src';
import type { AboutRow } from '../src';

type AboutArgs = {
  productName: string;
  version: string;
  withLegal: boolean;
  withCopy: boolean;
};

const ROWS: AboutRow[] = [
  { label: 'Host', value: 'electron' },
  { label: 'Platform', value: 'windows' },
  { label: 'Build', value: '2026.09.27' },
];

const LEGAL = 'An open-source project. Names and marks belong to their owners.';

const ARGS: Partial<AboutArgs> = { productName: 'My App', version: '1.4.0', withLegal: true, withCopy: true };

const ARG_TYPES: StoryLiteArgTypes<AboutArgs> = {
  productName: { control: 'text' },
  version: { control: 'text' },
  withLegal: { control: 'boolean' },
  withCopy: { control: 'boolean' },
};

const draw = (args: AboutArgs) => (
  <About
    productName={args.productName}
    rows={[{ label: 'Version', value: args.version }, ...ROWS]}
    legalText={args.withLegal ? LEGAL : undefined}
    copyText={args.withCopy ? `${args.productName} ${args.version}` : undefined}
  />
);

const meta = {
  title: 'Shell/About',
  parameters: { renderer: 'react' },
} satisfies StoryLiteMeta<AboutArgs>;

const Playground = {
  name: 'Playground',
  args: ARGS,
  argTypes: ARG_TYPES,
  render: (args) => draw(args),
} satisfies StoryLiteStoryDefinition<AboutArgs>;

const Minimal = {
  name: 'Facts only',
  args: ARGS,
  argTypes: ARG_TYPES,
  render: (args) => draw({ ...args, withLegal: false, withCopy: false }),
} satisfies StoryLiteStoryDefinition<AboutArgs>;

export default meta;
export { Minimal, Playground };
