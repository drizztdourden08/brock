/* @layer stories @kind story */
import type { StoryLiteMeta, StoryLiteStoryDefinition, StoryLiteArgTypes } from '@storylite/storylite';
import { Box } from '@drizztdourden08/tessera/primitives';
import { PlatformProvider, TitleBar } from '../src';
import type { MenuEntry } from '../src';

type TitleBarArgs = {
  productName: string;
  instanceName: string;
  withMenu: boolean;
  showPin: boolean;
};

const MENU: MenuEntry[] = [
  { key: 'home', label: 'Home', screen: 'home' },
  { key: 'tools', label: 'Tools', children: [{ key: 'logs', label: 'Logs', screen: 'logs' }] },
  'separator',
  { key: 'settings', label: 'Settings', screen: 'settings' },
  { key: 'about', label: 'About', screen: 'about' },
];

const ARGS: Partial<TitleBarArgs> = { productName: 'My App', instanceName: '', withMenu: true, showPin: true };

const ARG_TYPES: StoryLiteArgTypes<TitleBarArgs> = {
  productName: { control: 'text' },
  instanceName: { control: 'text' },
  withMenu: { control: 'boolean' },
  showPin: { control: 'boolean' },
};

const Demo = (props: TitleBarArgs) => {
  const { productName, instanceName, withMenu, showPin } = props;
  return (
    <PlatformProvider>
      <Box className="story-frame">
        <TitleBar
          productName={productName}
          menu={withMenu ? MENU : []}
          instanceName={instanceName || null}
          showPin={showPin}
        />
      </Box>
    </PlatformProvider>
  );
};

const meta = {
  title: 'Shell/TitleBar',
  parameters: { renderer: 'react' },
} satisfies StoryLiteMeta<TitleBarArgs>;

const Playground = {
  name: 'Playground',
  args: ARGS,
  argTypes: ARG_TYPES,
  render: (args) => <Demo {...args} />,
} satisfies StoryLiteStoryDefinition<TitleBarArgs>;

const NamedInstance = {
  name: 'Named instance',
  args: ARGS,
  argTypes: ARG_TYPES,
  render: (args) => <Demo {...args} instanceName="agent-7" />,
} satisfies StoryLiteStoryDefinition<TitleBarArgs>;

const NoMenu = {
  name: 'No menu',
  args: ARGS,
  argTypes: ARG_TYPES,
  render: (args) => <Demo {...args} withMenu={false} showPin={false} />,
} satisfies StoryLiteStoryDefinition<TitleBarArgs>;

export default meta;
export { NamedInstance, NoMenu, Playground };
