/* @layer renderer-shell @kind component */
import { Button } from '@drizztdourden08/tessera/primitives';
import type { ShortcutListGroup } from '@drizztdourden08/tessera/composites';
import { DialogShell, ShortcutList } from '@drizztdourden08/tessera/composites';
import { chordKeys } from '../../commands/chord-keys';
import { useCommandStore } from '../../commands/useCommandStore';
import { SHORTCUTS_HELP_LABEL } from '../shortcuts-help.constants';
import { useShortcutsHelpStore } from '../useShortcutsHelpStore';
import { useShortcutGroups } from './behavior/useShortcutGroups';
import './ShortcutsHelpDialog.css';

const ShortcutsHelpDialog = () => {
  const open = useShortcutsHelpStore((s) => s.open);
  const hide = useShortcutsHelpStore((s) => s.hide);
  const mac = useCommandStore((s) => s.mac);
  const groups = useShortcutGroups();
  const listed: ShortcutListGroup[] = groups.map((group) => ({
    label: group.title,
    items: group.rows.map((row) => ({ description: row.label, keys: chordKeys(row.shortcut, mac) })),
  }));

  return (
    <DialogShell open={open} onClose={hide} title={SHORTCUTS_HELP_LABEL} className="shortcuts-help" actions={<Button variant="tertiary" onClick={hide}>Close</Button>}>
      <ShortcutList groups={listed} label={SHORTCUTS_HELP_LABEL} size="md" />
    </DialogShell>
  );
};

export { ShortcutsHelpDialog };
