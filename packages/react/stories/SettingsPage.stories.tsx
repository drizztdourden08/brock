/* @layer stories @kind story */
import type { StoryLiteMeta, StoryLiteStoryDefinition, StoryLiteArgTypes } from '@storylite/storylite';
import { Box, Text } from '@drizztdourden08/tessera/primitives';
import { SettingsPage } from '../src';
import { gear } from './_samples/settings';

type PageArgs = {
  title: string;
  withAnchors: boolean;
};

const ANCHORS = [
  { id: 'one', label: 'First' },
  { id: 'two', label: 'Second' },
  { id: 'three', label: 'Third' },
];

const ARGS: Partial<PageArgs> = { title: 'Display', withAnchors: true };

const ARG_TYPES: StoryLiteArgTypes<PageArgs> = {
  title: { control: 'text' },
  withAnchors: { control: 'boolean' },
};

const Filler = (props: { id: string; label: string }) => {
  const { id, label } = props;
  return (
    <Box data-section={id} className="story-filler">
      <Text as="h2">{label}</Text>
      <Text>Rows for the {label.toLowerCase()} section go here.</Text>
    </Box>
  );
};

const draw = (args: PageArgs) => (
  <Box className="story-frame story-frame--tall">
    <SettingsPage icon={gear} title={args.title} anchors={args.withAnchors ? ANCHORS : undefined}>
      {ANCHORS.map((anchor) => <Filler key={anchor.id} id={anchor.id} label={anchor.label} />)}
    </SettingsPage>
  </Box>
);

const meta = {
  title: 'Settings/SettingsPage',
  parameters: { renderer: 'react' },
} satisfies StoryLiteMeta<PageArgs>;

const Playground = {
  name: 'Playground',
  args: ARGS,
  argTypes: ARG_TYPES,
  render: (args) => draw(args),
} satisfies StoryLiteStoryDefinition<PageArgs>;

const TitleOnly = {
  name: 'Title only',
  args: ARGS,
  argTypes: ARG_TYPES,
  render: (args) => draw({ ...args, withAnchors: false }),
} satisfies StoryLiteStoryDefinition<PageArgs>;

export default meta;
export { Playground, TitleOnly };
