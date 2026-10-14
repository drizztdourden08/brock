/* @layer renderer-shell @kind component */
import { Box, DropZone, Field, Inline, Small, Tag } from '@drizztdourden08/tessera/primitives';
import { formatBytes } from '@drizztdourden08/brock-core';
import { ATTACHMENTS_HINT, ATTACHMENTS_LABEL } from '../BugReportDialog.constants';
import type { AttachmentsFieldProps } from './AttachmentsField.type';

const AttachmentsField = (props: AttachmentsFieldProps) => {
  const { field, attachments, refused, onAdd, onRemove } = props;
  return (
    <Field label={ATTACHMENTS_LABEL} hint={`Up to ${field.maxFiles} files of ${formatBytes(field.maxBytes)} each.`} width="full">
      <Box className="bug-report__attachments">
        <DropZone variant="inline" size="sm" accept={[...field.accept]} label={ATTACHMENTS_HINT} disabled={attachments.length >= field.maxFiles} onDrop={onAdd} />
        {attachments.length > 0 && (
          <Inline gap="xs" wrap>
            {attachments.map((file, at) => (
              <Tag key={`${file.name}:${String(at)}`} name={file.name} onRemove={() => onRemove(at)}>{`${file.name} (${formatBytes(file.bytes.byteLength)})`}</Tag>
            ))}
          </Inline>
        )}
        {refused.map((reason) => <Small key={reason} tone="danger">{reason}</Small>)}
      </Box>
    </Field>
  );
};

export { AttachmentsField };
