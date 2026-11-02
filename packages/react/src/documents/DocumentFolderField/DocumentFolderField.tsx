/* @layer renderer-shell @kind component */
import { useId, useRef } from 'react';
import { PathInput } from '@drizztdourden08/tessera/composites';
import { Box, Field, Select, Stack } from '@drizztdourden08/tessera/primitives';
import { getPlatform } from '../../platform/get-platform';
import { useFolderField } from './behavior/useFolderField';
import { FOLDER_FIELD_TEXT } from './DocumentFolderField.constants';
import type { DocumentFolderFieldProps } from './DocumentFolderField.type';

const DocumentFolderField = (props: DocumentFolderFieldProps) => {
  const { value, label, disabled } = props;
  const inputId = useId();
  const ref = useRef<HTMLElement>(null);
  const field = useFolderField(props, ref);
  return (
    <Box ref={ref}>
      <Stack gap="xs">
        <Field label={label} htmlFor={inputId} error={field.reason}>
          <PathInput
            id={inputId}
            kind="folder"
            value={value}
            onChange={field.change}
            onBrowse={field.browse}
            resolvePath={getPlatform().filePicker.pathOf}
            placeholder={FOLDER_FIELD_TEXT.placeholder}
            disabled={disabled}
            invalid={field.reason !== null}
          />
        </Field>
        {field.rootOptions.length > 0 && (
          <Select
            options={field.rootOptions}
            value={field.rootValue}
            onChange={field.change}
            placeholder={FOLDER_FIELD_TEXT.rootsPlaceholder}
            aria-label={FOLDER_FIELD_TEXT.roots}
            disabled={disabled}
          />
        )}
      </Stack>
    </Box>
  );
};

export { DocumentFolderField };
