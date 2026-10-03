/* @layer stories @kind story */
import type { StoryLiteArgTypes, StoryLiteMeta, StoryLiteStoryDefinition } from '@storylite/storylite';
import { ReleaseNotesPanel } from '../../src/compounds/ReleaseNotesPanel';

type ReleaseNotesPanelArgs = {
  title: string;
  notes: string;
};

const NOTES = 'Added\n- Profiles can be renamed in place.\n\nFixed\n- The About screen scrolls on small windows.';

const ARG_TYPES: StoryLiteArgTypes<ReleaseNotesPanelArgs> = {
  title: { control: 'text' },
  notes: { control: 'text' },
};

const meta = {
  title: 'Compounds/ReleaseNotesPanel',
  parameters: { renderer: 'react' },
} satisfies StoryLiteMeta<ReleaseNotesPanelArgs>;

const Playground = {
  name: 'Playground',
  args: { title: 'Release notes', notes: NOTES },
  argTypes: ARG_TYPES,
  render: (args) => <ReleaseNotesPanel title={args.title}>{args.notes}</ReleaseNotesPanel>,
} satisfies StoryLiteStoryDefinition<ReleaseNotesPanelArgs>;

const Default = {
  name: 'Default',
  render: () => <ReleaseNotesPanel>{NOTES}</ReleaseNotesPanel>,
} satisfies StoryLiteStoryDefinition<ReleaseNotesPanelArgs>;

export default meta;
export { Default, Playground };
