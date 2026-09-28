/* @layer stories @kind story */
import { useState } from 'react';
import type { StoryLiteMeta, StoryLiteStoryDefinition, StoryLiteArgTypes } from '@storylite/storylite';
import { SettingsLayout, SettingsPageContext } from '../src';
import { AUDIO_SECTION, DEVELOPER_SECTION, SAMPLE_DEFAULTS, WINDOW_SECTION, gear } from './_samples/settings';
import type { SampleSettings } from './_samples/settings';

type LayoutArgs = {
  withDefaults: boolean;
  lockDeveloper: boolean;
  asPage: boolean;
};

const SECTIONS = [WINDOW_SECTION, AUDIO_SECTION, DEVELOPER_SECTION];

const ARGS: Partial<LayoutArgs> = { withDefaults: true, lockDeveloper: false, asPage: true };

const ARG_TYPES: StoryLiteArgTypes<LayoutArgs> = {
  withDefaults: { control: 'boolean' },
  lockDeveloper: { control: 'boolean' },
  asPage: { control: 'boolean' },
};

const Demo = (props: LayoutArgs) => {
  const { withDefaults, lockDeveloper, asPage } = props;
  const [settings, setSettings] = useState<SampleSettings>({ ...SAMPLE_DEFAULTS, showTips: false });
  const layout = (
    <SettingsLayout
      sections={SECTIONS}
      settings={settings}
      defaults={withDefaults ? SAMPLE_DEFAULTS : undefined}
      onChange={(patch) => setSettings((prev) => ({ ...prev, ...patch }))}
      lockCauseOf={(key) => (lockDeveloper && key.startsWith('developer') ? 'Locked by policy' : null)}
    />
  );
  if (!asPage) return layout;
  return (
    <SettingsPageContext.Provider value={{ variant: 'page', icon: gear, title: 'General', query: '' }}>
      {layout}
    </SettingsPageContext.Provider>
  );
};

const meta = {
  title: 'Settings/SettingsLayout',
  parameters: { renderer: 'react' },
} satisfies StoryLiteMeta<LayoutArgs>;

const Playground = {
  name: 'Playground',
  args: ARGS,
  argTypes: ARG_TYPES,
  render: (args) => <Demo {...args} />,
} satisfies StoryLiteStoryDefinition<LayoutArgs>;

const Bare = {
  name: 'Bare sections',
  args: ARGS,
  argTypes: ARG_TYPES,
  render: (args) => <Demo {...args} asPage={false} />,
} satisfies StoryLiteStoryDefinition<LayoutArgs>;

const Locked = {
  name: 'Locked run',
  args: ARGS,
  argTypes: ARG_TYPES,
  render: (args) => <Demo {...args} lockDeveloper />,
} satisfies StoryLiteStoryDefinition<LayoutArgs>;

export default meta;
export { Bare, Locked, Playground };
