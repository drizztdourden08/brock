/* @layer renderer-shell @kind component */
import { Box, Callout, Checkbox, Field, Small, TextInput, Textarea } from '@drizztdourden08/tessera/primitives';
import { CLIPBOARD_NOTE, DESCRIPTION_ROWS } from '../BugReportDialog.constants';
import { AttachmentsField } from './AttachmentsField';
import { ContactField } from './ContactField';
import { DiagnosticsPreview } from './DiagnosticsPreview';
import type { BugReportFormBodyProps } from './BugReportFormBody.type';

const BugReportFormBody = (props: BugReportFormBodyProps) => {
  const { form } = props;
  const { extras } = form;
  const viaTransport = form.target?.kind === 'transport';
  return (
    <Box className="bug-report__form">
      <Field label="Title" required width="full">
        <TextInput value={form.title} placeholder="A short summary" onChange={(e) => form.setTitle(e.target.value)} />
      </Field>
      <Field label="What happened" required width="full" hint="What you did, what you expected, and what you saw instead.">
        <Textarea rows={DESCRIPTION_ROWS} value={form.description} onChange={(e) => form.setDescription(e.target.value)} />
      </Field>
      {viaTransport && extras.fields.contact && <ContactField field={extras.fields.contact} value={extras.contact} error={extras.contactError} onChange={extras.setContact} />}
      {viaTransport && extras.fields.attachments && (
        <AttachmentsField field={extras.fields.attachments} attachments={extras.attachments} refused={extras.refused} onAdd={extras.addFiles} onRemove={extras.removeAttachment} />
      )}
      <Checkbox checked={form.attach} onChange={form.setAttach} label="Attach diagnostics (system info, versions, recent log)" />
      {form.attach && <DiagnosticsPreview text={form.diagnostics} />}
      {form.error !== null && <Callout tone="danger">The report was not sent: {form.error}</Callout>}
      {form.target?.kind === 'clipboard' && <Small tone="muted">{CLIPBOARD_NOTE}</Small>}
    </Box>
  );
};

export { BugReportFormBody };
