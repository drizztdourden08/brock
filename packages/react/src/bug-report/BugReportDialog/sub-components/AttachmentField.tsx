/* @layer renderer-shell @kind component */
import { formatBytes } from '@drizztdourden08/brock-core';
import { Box, DropZone, Field, Tag } from '@drizztdourden08/tessera/primitives';
import type { AttachmentFieldProps } from './AttachmentField.type';
import { ATTACH_FILES_LABEL } from '../BugReportDialog.constants';

const AttachmentField = (props: AttachmentFieldProps) => {
  const { model, disabled } = props;
  const { files, refused, limits } = model;
  if (!limits) return null;

  const hint = `Optional. Up to ${limits.maxFiles} files, ${formatBytes(limits.maxBytes)} in all.`;
  const full = files.length >= limits.maxFiles;

  return (
    <Field label="Attachments" hint={hint} error={refused ?? undefined} width="full">
      <Box className="bug-report__attachments">
        <DropZone variant="inline" size="sm" label={ATTACH_FILES_LABEL} disabled={disabled || full} onDrop={model.add} />
        {files.map((file, index) => (
          <Tag key={`${file.name}-${index}`} name={file.name} onRemove={disabled ? undefined : () => model.remove(index)}>
            {`${file.name} (${formatBytes(file.size)})`}
          </Tag>
        ))}
      </Box>
    </Field>
  );
};

export { AttachmentField };
