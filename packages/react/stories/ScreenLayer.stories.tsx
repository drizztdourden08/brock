/* @layer stories @kind story */
import { useState } from 'react';
import type { StoryLiteMeta, StoryLiteStoryDefinition, StoryLiteArgTypes } from '@storylite/storylite';
import { Badge, Box, Button, Text } from '@drizztdourden08/tessera/primitives';
import { ScreenLayer } from '../src';

type LayerArgs = {
  title: string;
  subtitle: string;
  withExtra: boolean;
};

const ARGS: Partial<LayerArgs> = { title: 'Settings', subtitle: 'mira', withExtra: false };

const ARG_TYPES: StoryLiteArgTypes<LayerArgs> = {
  title: { control: 'text' },
  subtitle: { control: 'text' },
  withExtra: { control: 'boolean' },
};

const Demo = (props: LayerArgs) => {
  const { title, subtitle, withExtra } = props;
  const [open, setOpen] = useState(true);
  return (
    <Box className="story-frame story-frame--tall">
      {!open && <Button onClick={() => setOpen(true)}>Open screen</Button>}
      {open && (
        <ScreenLayer
          title={title}
          subtitle={subtitle || undefined}
          extra={withExtra ? <Badge variant="success">saved</Badge> : undefined}
          onClose={() => setOpen(false)}
        >
          <Text>The screen body goes here.</Text>
        </ScreenLayer>
      )}
    </Box>
  );
};

const meta = {
  title: 'Shell/ScreenLayer',
  parameters: { renderer: 'react' },
} satisfies StoryLiteMeta<LayerArgs>;

const Playground = {
  name: 'Playground',
  args: ARGS,
  argTypes: ARG_TYPES,
  render: (args) => <Demo {...args} />,
} satisfies StoryLiteStoryDefinition<LayerArgs>;

export default meta;
export { Playground };
