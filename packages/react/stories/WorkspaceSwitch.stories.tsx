/* @layer stories @kind story */
import { useState } from 'react';
import type { StoryLiteMeta, StoryLiteStoryDefinition, StoryLiteArgTypes } from '@storylite/storylite';
import { Box, Icon, Text } from '@drizztdourden08/tessera/primitives';
import { WorkspaceSwitch } from '../src';
import type { WorkspaceItem } from '../src';

type SwitchArgs = {
  secondDisabled: boolean;
};

const items = (secondDisabled: boolean): WorkspaceItem[] => [
  { id: 'play', label: 'Play', icon: <Icon name="play" /> },
  { id: 'data', label: 'Data', icon: <Icon name="square" />, disabled: secondDisabled },
];

const ARGS: Partial<SwitchArgs> = { secondDisabled: false };

const ARG_TYPES: StoryLiteArgTypes<SwitchArgs> = {
  secondDisabled: { control: 'boolean' },
};

const Demo = (props: SwitchArgs) => {
  const { secondDisabled } = props;
  const [current, setCurrent] = useState('play');
  return (
    <Box className="story-column">
      <WorkspaceSwitch items={items(secondDisabled)} current={current} onSelect={setCurrent} />
      <Text className="story-label">Current: {current}</Text>
    </Box>
  );
};

const meta = {
  title: 'Shell/WorkspaceSwitch',
  parameters: { renderer: 'react' },
} satisfies StoryLiteMeta<SwitchArgs>;

const Playground = {
  name: 'Playground',
  args: ARGS,
  argTypes: ARG_TYPES,
  render: (args) => <Demo {...args} />,
} satisfies StoryLiteStoryDefinition<SwitchArgs>;

export default meta;
export { Playground };
