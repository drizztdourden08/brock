/* @layer stories @kind story */
import type { StoryLiteArgTypes, StoryLiteMeta, StoryLiteStoryDefinition } from '@storylite/storylite';
import { AboutPanel } from '../../src/compounds/AboutPanel';

type AboutPanelArgs = {
  title: string;
  branded: boolean;
  copyReady: boolean;
};

const ROWS = [
  { label: 'Version', value: '0.4.0' },
  { label: 'Runtime', value: 'Electron 42' },
  { label: 'Platform', value: 'Windows x64' },
];

const ARG_TYPES: StoryLiteArgTypes<AboutPanelArgs> = {
  title: { control: 'text' },
  branded: { control: 'boolean' },
  copyReady: { control: 'boolean' },
};

const meta = {
  title: 'Compounds/AboutPanel',
  parameters: { renderer: 'react' },
} satisfies StoryLiteMeta<AboutPanelArgs>;

const Playground = {
  name: 'Playground',
  args: { title: 'Brock', branded: true, copyReady: true },
  argTypes: ARG_TYPES,
  render: (args) => (
    <AboutPanel
      title={args.title}
      brand={args.branded ? 'brock' : undefined}
      heading={args.title === 'Brock' ? 'wordmark' : 'title'}
      rows={ROWS}
      copyText={args.copyReady ? 'Brock 0.4.0' : null}
      legal="Names and marks belong to their owners."
    />
  ),
} satisfies StoryLiteStoryDefinition<AboutPanelArgs>;

const Default = {
  name: 'Default',
  render: () => <AboutPanel title="My App" rows={ROWS} copyText="My App 0.4.0" />,
} satisfies StoryLiteStoryDefinition<AboutPanelArgs>;

export default meta;
export { Default, Playground };
