/* @layer renderer-shell @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'A premade list of profiles to pick, create, rename and delete, with the create form, the rename field and the delete question in place.',
  useWhen: [
    'The profiles screen of a Brock app, or a first run that asks for a profile.',
    'Any list of named saves the user picks one of and manages in place.',
  ],
  avoidWhen: [
    { case: 'A few modes picked from a floating switch, with no create or delete.', use: 'FloatingSwitch' },
    { case: 'A list of records, each with its own actions.', use: 'ListItemRow' },
    { case: 'A record with many fields, created in a dialog.', use: 'CreateRecordDialog' },
  ],
  rules: [
    'Wire it to useProfiles in the view that draws it; the panel keeps only the state of its forms.',
    'Return a promise from onCreate and onRename: the form closes when it resolves, and a rejection shows its message in the form.',
    'Set createOpen while no profile exists: the create form stays open, with no cancel.',
    'Leave onRename or onDelete out to drop that action from every row.',
    'Pass extraFields and canSubmit for the fields a new profile needs beyond its name.',
  ],
  a11y: [
    'The profiles are a list; each row is a button, pressed while it is the selected profile.',
    'Delete asks once in the row before it calls onDelete.',
    'The rename and delete buttons are named after the profile, such as Rename Mira.',
  ],
  tree: {
    path: ['navigation', 'between profiles'],
    rule: 'Pick, create, rename and delete profiles in one list.',
  },
  example: `import { ProfilesPanel } from '@drizztdourden08/brock-react';

const ProfilesSample = ({ onSelect }: { onSelect: (id: string) => void }) => (
  <ProfilesPanel
    title="Pick a profile, or create another"
    profiles={[{ id: 'p1', name: 'Mira', aside: 'today' }]}
    onSelect={onSelect}
    onCreate={async () => {}}
    onRename={async () => {}}
    onDelete={() => {}}
  />
);
`,
  propsHash: '72c9beaaab81592b',
} satisfies ComponentUsage;

export { usage };
