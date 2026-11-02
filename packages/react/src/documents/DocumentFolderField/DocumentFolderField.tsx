/* @layer renderer-shell @kind component */
import { useId } from 'react';
import { PathInput } from '@drizztdourden08/tessera/composites';
import { Field, Select, Stack } from '@drizztdourden08/tessera/primitives';
import { getPlatform } from '../../platform/get-platform';
import { useFolderField } from './behavior/useFolderField';
import { FOLDER_FIELD_TEXT } from './DocumentFolderField.constants';
import type { DocumentFolderFieldProps } from './DocumentFolderField.type';

const DocumentFolderField = (props: DocumentFolderFieldProps) => {
  const { value, onChange, label, disabled } = props;
  const inputId = useId();
  const field = useFolderField(props);
  return (
    <Stack gap="xs">
      <Field label={label} htmlFor={inputId} error={field.reason}>
        <PathInput
          id={inputId}
          kind="folder"
          value={value}
          onChange={onChange}
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
          onChange={onChange}
          placeholder={FOLDER_FIELD_TEXT.rootsPlaceholder}
          aria-label={FOLDER_FIELD_TEXT.roots}
          disabled={disabled}
        />
      )}
    </Stack>
  );
};

export { DocumentFolderField };
