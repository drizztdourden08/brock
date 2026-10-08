/* @layer renderer-shell @kind component */
import { Box, Button, Callout, Checkbox, Field, Small, TextInput, Textarea } from '@drizztdourden08/tessera/primitives';
import { DialogShell } from '@drizztdourden08/tessera/composites';
import { useBugReportForm } from './behavior/useBugReportForm';
import { DiagnosticsPreview } from './sub-components/DiagnosticsPreview';
import { CLIPBOARD_NOTE, DESCRIPTION_ROWS, SENDING_LABEL } from './BugReportDialog.constants';
import './BugReportDialog.css';

const BugReportDialog = () => {
  const form = useBugReportForm();

  const actions = (
    <>
      <Button variant="tertiary" onClick={form.close} disabled={form.sending}>Cancel</Button>
      <Button variant="primary" onClick={form.send} disabled={!form.canSend} loading={form.sending}>
        {form.sending ? SENDING_LABEL : form.target?.label ?? SENDING_LABEL}
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
        {form.error !== null && <Callout tone="danger">The report was not sent: {form.error}</Callout>}
        {form.target?.kind === 'clipboard' && <Small tone="muted">{CLIPBOARD_NOTE}</Small>}
      </Box>
    </DialogShell>
  );
};

export { BugReportDialog };
