/* @layer renderer-shell @kind component */
import { Box, Text } from '@drizztdourden08/tessera/primitives';
import { DialogShell } from '@drizztdourden08/tessera/composites';
import { dialogTitle } from './behavior/dialog-title';
import { useUpdateDialog } from './behavior/useUpdateDialog';
import { DialogActions } from './sub-components/DialogActions';
import { DownloadStatus } from './sub-components/DownloadStatus';
import { ReleaseNotes } from './sub-components/ReleaseNotes';
import { UpdateFootnote } from './sub-components/UpdateFootnote';
import { UpdateSummary } from './sub-components/UpdateSummary';
import { VersionPicker } from './sub-components/VersionPicker';
import './UpdateDialog.css';

const UpdateDialog = () => {
  const { store, choice, confirmRef, onAllowPrerelease, busy, notes, showPicker, showPrereleaseNote, showFootnote } = useUpdateDialog();
  const { dialogOpen, status, info, prefs, capabilities, closeDialog } = store;

  const actions = (
    <DialogActions
      status={status}
      canCheck={capabilities.canCheck}
      canInstall={capabilities.canInstall}
      hasChoices={store.versions.length > 0}
      selected={choice.selected}
      isLatest={choice.isLatest}
      action={choice.action}
      info={info}
      confirmRef={confirmRef}
      onApply={store.apply}
      onOpenReleasePage={store.openReleasePage}
      onClose={closeDialog}
    />
  );

  return (
    <DialogShell
      open={dialogOpen}
      onClose={closeDialog}
      className="update-dialog"
      title={dialogTitle(status, info, capabilities)}
      actions={actions}
      initialFocusRef={confirmRef}
    >
      <Box className="update-dialog__body">
        <UpdateSummary status={status} info={info} currentVersion={store.currentVersion} capabilities={capabilities} />
        {showPicker && (
          <VersionPicker
            groups={choice.groups}
            selected={choice.selected}
            onSelect={choice.setSelected}
            allowPrerelease={prefs.allowPrerelease}
            onAllowPrerelease={onAllowPrerelease}
            disabled={busy}
          />
        )}
        {showPrereleaseNote && (
          <Text as="p" className="update-dialog__warning" role="note">
            This is a pre-release. It ships before the usual testing, so expect rough edges and bugs the stable builds do not have.
          </Text>
        )}
        {notes.length > 0 && <ReleaseNotes notes={notes} />}
        <DownloadStatus status={status} percent={store.percent} error={store.error} canInstall={capabilities.canInstall} info={info} />
        {showFootnote && <UpdateFootnote onReportBug={closeDialog} />}
      </Box>
    </DialogShell>
  );
};

export { UpdateDialog };
