/* @layer renderer-shell @kind component */
import { Box, Button, Checkbox, Field, Small, TextInput, Textarea } from '@drizztdourden08/tessera/primitives';
import { DialogShell } from '@drizztdourden08/tessera/composites';
import { useBugReportForm } from './behavior/useBugReportForm';
import { DiagnosticsPreview } from './sub-components/DiagnosticsPreview';
import { DESCRIPTION_ROWS } from './BugReportDialog.constants';
import './BugReportDialog.css';

const BugReportDialog = () => {
  const form = useBugReportForm();

  const actions = (
    <>
      <Button variant="tertiary" onClick={form.close}>Cancel</Button>
      <Button variant="primary" onClick={form.send} disabled={!form.canSend}>
        {form.hasRepo ? 'Open GitHub issue' : 'Copy report'}
      </Button>
    </>
  );

  return (
    <DialogShell open={form.open} onClose={form.close} title="Report a bug" className="bug-report" actions={actions}>
      <Box className="bug-report__form">
        <Field label="Title" required width="full">
          <TextInput value={form.title} placeholder="A short summary" onChange={(e) => form.setTitle(e.target.value)} />
        </Field>
        <Field label="What happened" required width="full" hint="What you did, what you expected, and what you saw instead.">
          <Textarea rows={DESCRIPTION_ROWS} value={form.description} onChange={(e) => form.setDescription(e.target.value)} />
        </Field>
        <Checkbox checked={form.attach} onChange={form.setAttach} label="Attach diagnostics (system info, versions, recent log)" />
        {form.attach && <DiagnosticsPreview text={form.diagnostics} />}
        {!form.hasRepo && (
          <Small tone="muted">This app has no issue tracker, so the report is copied for you to send.</Small>
        )}
      </Box>
    </DialogShell>
  );
};

export { BugReportDialog };
