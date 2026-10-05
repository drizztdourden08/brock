/* @layer renderer-shell @kind data */
import type { ComponentUsage } from '@drizztdourden08/tessera';

const usage = {
  job: 'A premade list of profiles to pick, create, rename and delete, drawn by ManagedList, with the create form at the top of the list.',
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
    'Return a promise from onCreate and onRename: the create form closes when it resolves and shows the message of a rejection; a failed rename shows its message above the list.',
    'Set createOpen while no profile exists: the create form stays open, with no Cancel, and Escape leaves it open.',
    'Leave onRename or onDelete out to drop that action from every row.',
    'Pass extraFields and canSubmit for the fields a new profile needs beyond its name.',
  ],
  a11y: [
    'The profiles are a list in a section named Profiles; each row is a button, pressed while it is the active profile.',
    'A click, Enter or Space on a row makes it the active profile; the arrow keys, Home and End only move focus, and F2 renames the focused row.',
    'The rows are one Tab stop; Tab from the focused row reaches its rename and delete.',
    'New moves focus to the name field; Escape or Cancel closes the form and focus goes back to New; after a create, focus goes to the new row.',
    'Rename and delete show on the active row, and on any other row under the pointer or while it holds focus; delete asks once in the row before it calls onDelete.',
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
