/* @layer renderer-shell @kind component */
import { Box, Button, SectionHeader, Shortcut, Span } from '@drizztdourden08/tessera/primitives';
import { DialogShell } from '@drizztdourden08/tessera/composites';
import { shortcutKeys } from '../shortcut-keys';
import { SHORTCUTS_HELP_LABEL } from '../shortcuts-help.constants';
import { useShortcutsHelpStore } from '../useShortcutsHelpStore';
import { useShortcutGroups } from './behavior/useShortcutGroups';
import './ShortcutsHelpDialog.css';

const ShortcutsHelpDialog = () => {
  const open = useShortcutsHelpStore((s) => s.open);
  const hide = useShortcutsHelpStore((s) => s.hide);
  const groups = useShortcutGroups();

  return (
    <DialogShell open={open} onClose={hide} title={SHORTCUTS_HELP_LABEL} className="shortcuts-help" actions={<Button variant="tertiary" onClick={hide}>Close</Button>}>
      {groups.map((group) => (
        <Box key={group.title} as="section" className="shortcuts-help__group">
          <SectionHeader title={group.title} />
          <Box as="dl" className="shortcuts-help__list">
            {group.rows.map((row) => (
              <Box key={`${row.label}-${row.shortcut}`} className="shortcuts-help__row">
                <Box as="dt"><Span>{row.label}</Span></Box>
                <Box as="dd" className="shortcuts-help__keys"><Shortcut keys={shortcutKeys(row.shortcut)} size="xs" /></Box>
              </Box>
            ))}
          </Box>
        </Box>
      ))}
    </DialogShell>
  );
};

export { ShortcutsHelpDialog };
