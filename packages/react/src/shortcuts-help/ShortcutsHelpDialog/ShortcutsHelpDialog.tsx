/* @layer renderer-shell @kind component */
import { useMemo } from 'react';
import { Button } from '@drizztdourden08/tessera/primitives';
import type { ShortcutListGroup } from '@drizztdourden08/tessera/composites';
import { DialogShell, ShortcutList } from '@drizztdourden08/tessera/composites';
import { shortcutKeys } from '../shortcut-keys';
import { SHORTCUTS_HELP_LABEL } from '../shortcuts-help.constants';
import { useShortcutsHelpStore } from '../useShortcutsHelpStore';
import { useShortcutGroups } from './behavior/useShortcutGroups';
import './ShortcutsHelpDialog.css';

const ShortcutsHelpDialog = () => {
  const open = useShortcutsHelpStore((s) => s.open);
  const hide = useShortcutsHelpStore((s) => s.hide);
  const groups = useShortcutGroups();
  const listed = useMemo<ShortcutListGroup[]>(() => groups.map((group) => ({
    label: group.title,
    items: group.rows.map((row) => ({ description: row.label, keys: shortcutKeys(row.shortcut) })),
  })), [groups]);

  return (
    <DialogShell open={open} onClose={hide} title={SHORTCUTS_HELP_LABEL} className="shortcuts-help" actions={<Button variant="tertiary" onClick={hide}>Close</Button>}>
      <ShortcutList groups={listed} label={SHORTCUTS_HELP_LABEL} size="md" />
    </DialogShell>
  );
};

export { ShortcutsHelpDialog };
