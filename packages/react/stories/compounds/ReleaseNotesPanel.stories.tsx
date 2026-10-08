/* @layer stories @kind story */
import type { StoryLiteArgTypes, StoryLiteMeta, StoryLiteStoryDefinition } from '@storylite/storylite';
import { ReleaseNotesPanel } from '../../src/compounds/ReleaseNotesPanel';

type ReleaseNotesPanelArgs = {
  title: string;
  notes: string;
};

const NOTES = 'Added\n- Profiles can be renamed in place.\n\nFixed\n- The About screen scrolls on small windows.';

const NOTE = [
  '# Atlas v1.2.0',
  '',
  'Profiles can be renamed in place, and the About screen fits small windows.',
  '',
  '## New',
  '',
  '- Profiles can be renamed in place from the profile list.',
  '- The [user guide](https://example.com/guide) covers each screen.',
  '',
  '## Fixes',
  '',
  '- The About screen scrolls on small windows.',
].join('\n');

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

const ReleaseNote = {
  name: 'Release note in markdown',
  render: () => <ReleaseNotesPanel markdown onOpenLink={() => undefined}>{NOTE}</ReleaseNotesPanel>,
} satisfies StoryLiteStoryDefinition<ReleaseNotesPanelArgs>;

export default meta;
export { Default, Playground, ReleaseNote };
