/* @layer renderer-shell @kind component */
import { Box, Checkbox, Field, Small, TextInput, Textarea } from '@drizztdourden08/tessera/primitives';
import { DialogShell } from '@drizztdourden08/tessera/composites';
import { useBugReportForm } from './behavior/useBugReportForm';
import { AttachmentField } from './sub-components/AttachmentField';
import { BugReportActions } from './sub-components/BugReportActions';
import { ContactField } from './sub-components/ContactField';
import { DiagnosticsPreview } from './sub-components/DiagnosticsPreview';
import { ReportSection } from './sub-components/ReportSection';
import { SendError } from './sub-components/SendError';
import { SentView } from './sub-components/SentView';
import { CLIPBOARD_NOTE, DESCRIPTION_ROWS, REPORT_TITLE, SENT_TITLE } from './BugReportDialog.constants';
import './BugReportDialog.css';

const BugReportDialog = () => {
  const form = useBugReportForm();
  const { sent } = form;

  return (
    <DialogShell open={form.open} onClose={form.close} title={sent ? SENT_TITLE : REPORT_TITLE} className="bug-report" actions={<BugReportActions form={form} />}>
      {sent ? <SentView receipt={sent} retry={form.retry} /> : (
        <Box className="bug-report__form">
          <Field label="Title" required width="full">
            <TextInput value={form.title} placeholder="A short summary" onChange={(e) => form.setTitle(e.target.value)} />
          </Field>
          <Field label="What happened" required width="full" hint="What you did, what you expected, and what you saw instead.">
            <Textarea rows={DESCRIPTION_ROWS} value={form.description} onChange={(e) => form.setDescription(e.target.value)} />
          </Field>
          <ContactField shown={form.fields?.contact === true} identity={form.fields?.identity} value={form.contact} onChange={form.setContact} />
          <AttachmentField model={form.attachments} disabled={form.sending} />
          <ReportSection section={form.section} setExtras={form.setSectionExtras} disabled={form.sending} />
          <Checkbox checked={form.attach} onChange={form.setAttach} label="Attach diagnostics (system info, versions, recent log)" />
          {form.attach && <DiagnosticsPreview text={form.diagnostics} />}
          <SendError error={form.error} fallback={form.fallback} />
          {form.target?.kind === 'clipboard' && <Small tone="muted">{CLIPBOARD_NOTE}</Small>}
        </Box>
      )}
    </DialogShell>
  );
};

export { BugReportDialog };
