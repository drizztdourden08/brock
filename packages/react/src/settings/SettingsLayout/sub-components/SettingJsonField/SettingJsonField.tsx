/* @layer renderer-shell @kind component */
import { useId } from 'react';
import { CodeBlock } from '@drizztdourden08/tessera/composites';
import { Small, Stack } from '@drizztdourden08/tessera/primitives';
import { useJsonText } from './behavior/useJsonText';
import type { SettingJsonFieldProps } from './SettingJsonField.type';

const SettingJsonField = (props: SettingJsonFieldProps) => {
  const { control, value, onChange, label, disabled } = props;
  const { text, edit, problem } = useJsonText(value, onChange, control.shape);
  const problemId = useId();
  return (
    <Stack gap="xs">
      <CodeBlock
        editable
        language="json"
        value={text}
        onChange={edit}
        invalid={problem !== null}
        problemLine={problem?.line}
        disabled={disabled}
        aria-label={label}
        aria-describedby={problem ? problemId : undefined}
      />
      {problem && <Small id={problemId} tone="danger" role="alert">{problem.message}</Small>}
    </Stack>
  );
};

export { SettingJsonField };
