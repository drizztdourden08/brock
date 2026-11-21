/* @layer renderer-shell @kind component */
import { msg } from '@drizztdourden08/brock-core/i18n';
import { BugReportButton, ReleaseNotesPanel, openExternal, useText } from '@drizztdourden08/brock-react';
import { Box, Callout } from '@drizztdourden08/tessera/primitives';
import { DialogShell } from '@drizztdourden08/tessera/composites';
import { dialogTitle } from './behavior/dialog-title';
import { useUpdateDialog } from './behavior/useUpdateDialog';
import { DialogActions } from './sub-components/DialogActions';
import { DownloadStatus } from './sub-components/DownloadStatus';
import { UpdateSummary } from './sub-components/UpdateSummary';
import { VersionPicker } from './sub-components/VersionPicker';
import { UpdateNoticeSlot } from './sub-components/UpdateNoticeSlot';
import './UpdateDialog.css';

const UpdateDialog = () => {
  const text = useText();
  const { store, choice, confirmRef, onAllowPrerelease, busy, notes, notice, showPicker, showPrereleaseNote, showFootnote } = useUpdateDialog();
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
      title={text(dialogTitle(status, info, capabilities))}
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
          <Callout>
            {text(msg('updater:dialog.prereleaseNote'))}
          </Callout>
        )}
        {notice !== null && <UpdateNoticeSlot>{notice}</UpdateNoticeSlot>}
        {notes.length > 0 && <ReleaseNotesPanel markdown onOpenLink={openExternal}>{notes}</ReleaseNotesPanel>}
        <DownloadStatus status={status} percent={store.percent} error={store.error} canInstall={capabilities.canInstall} info={info} />
        {showFootnote && (
          <Callout variant="footnote" action={<BugReportButton onBeforeOpen={closeDialog} />}>
            {text(msg('updater:dialog.footnote'))}
          </Callout>
        )}
      </Box>
    </DialogShell>
  );
};

export { UpdateDialog };
