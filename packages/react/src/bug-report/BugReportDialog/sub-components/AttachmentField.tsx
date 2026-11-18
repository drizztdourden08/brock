/* @layer renderer-shell @kind component */
import { formatBytes } from '@drizztdourden08/brock-core';
import { Box, DropZone, Field, Tag } from '@drizztdourden08/tessera/primitives';
import { useT, useText } from '../../../i18n';
import type { AttachmentFieldProps } from './AttachmentField.type';
import { ATTACH_FILES_LABEL } from '../BugReportDialog.constants';

const AttachmentField = (props: AttachmentFieldProps) => {
  const { model, disabled } = props;
  const { files, refused, limits } = model;
  const t = useT();
  const text = useText();
  if (!limits) return null;

  const hint = t('brock-app:bugReport.attach.hint', { count: limits.maxFiles, size: formatBytes(limits.maxBytes) });
  const full = files.length >= limits.maxFiles;

  return (
    <Field label={t('brock-app:bugReport.attach.label')} hint={hint} error={refused === null ? undefined : text(refused)} width="full">
      <Box className="bug-report__attachments">
        <DropZone variant="inline" size="sm" label={text(ATTACH_FILES_LABEL)} disabled={disabled || full} onDrop={model.add} />
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
