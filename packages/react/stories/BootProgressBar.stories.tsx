/* @layer stories @kind story */
import { useEffect } from 'react';
import type { StoryLiteMeta, StoryLiteStoryDefinition, StoryLiteArgTypes } from '@storylite/storylite';
import { Box, Text } from '@drizztdourden08/tessera/primitives';
import { BootProgressBar, bootProgress } from '../src';

type BootBarArgs = {
  message: string;
  ratio: number;
  indeterminate: boolean;
};

const ARGS: Partial<BootBarArgs> = { message: 'Loading the core', ratio: 0.4, indeterminate: false };

const ARG_TYPES: StoryLiteArgTypes<BootBarArgs> = {
  message: { control: 'text' },
  ratio: { control: 'number' },
  indeterminate: { control: 'boolean' },
};

const Demo = (props: BootBarArgs) => {
  const { message, ratio, indeterminate } = props;
  useEffect(() => {
    bootProgress.start(message, indeterminate ? null : Math.min(1, Math.max(0, ratio)));
    return () => bootProgress.reset();
  }, [message, ratio, indeterminate]);
  return (
    <Box className="story-frame">
      <Text className="story-label">The bar sits along the bottom edge of the viewport.</Text>
      <BootProgressBar />
    </Box>
  );
};

const meta = {
  title: 'Shell/BootProgressBar',
  parameters: { renderer: 'react' },
} satisfies StoryLiteMeta<BootBarArgs>;

const Playground = {
  name: 'Playground',
  args: ARGS,
  argTypes: ARG_TYPES,
  render: (args) => <Demo {...args} />,
} satisfies StoryLiteStoryDefinition<BootBarArgs>;

const Indeterminate = {
  name: 'Indeterminate',
  args: ARGS,
  argTypes: ARG_TYPES,
  render: (args) => <Demo {...args} indeterminate />,
} satisfies StoryLiteStoryDefinition<BootBarArgs>;

export default meta;
export { Indeterminate, Playground };
