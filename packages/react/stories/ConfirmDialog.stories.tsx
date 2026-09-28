/* @layer stories @kind story */
import type { StoryLiteMeta, StoryLiteStoryDefinition, StoryLiteArgTypes } from '@storylite/storylite';
import { Box, Button, Text } from '@drizztdourden08/tessera/primitives';
import { ConfirmDialog, dialogs, useDialogStore } from '../src';

type DialogArgs = {
  title: string;
  message: string;
  danger: boolean;
};

const ARGS: Partial<DialogArgs> = { title: 'Delete profile', message: 'Delete "mira" and everything saved in it?', danger: true };

const ARG_TYPES: StoryLiteArgTypes<DialogArgs> = {
  title: { control: 'text' },
  message: { control: 'text' },
  danger: { control: 'boolean' },
};

const Demo = (props: DialogArgs) => {
  const { title, message, danger } = props;
  const open = useDialogStore((s) => s.dialog !== null);
  const show = () => dialogs.show({
    title,
    message,
    variant: danger ? 'danger' : 'default',
    confirmLabel: danger ? 'Delete' : 'OK',
    onConfirm: () => dialogs.dismiss(),
  });
  return (
    <Box className="story-column">
      <Button variant={danger ? 'danger' : 'primary'} onClick={show}>Open dialog</Button>
      <Text className="story-label">{open ? 'Dialog open' : 'Dialog closed'}</Text>
      <ConfirmDialog />
    </Box>
  );
};

const meta = {
  title: 'Shell/ConfirmDialog',
  parameters: { renderer: 'react' },
} satisfies StoryLiteMeta<DialogArgs>;

const Playground = {
  name: 'Playground',
  args: ARGS,
  argTypes: ARG_TYPES,
  render: (args) => <Demo {...args} />,
} satisfies StoryLiteStoryDefinition<DialogArgs>;

export default meta;
export { Playground };
