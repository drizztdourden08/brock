/* @layer renderer-shell @kind component */
import { useText } from '@drizztdourden08/brock-react';
import { Field } from '@drizztdourden08/tessera/primitives';
import { DynamicInput } from '@drizztdourden08/tessera/composites';
import { codeSlotsOf } from './behavior/code-slots-of';
import { CODE_LABEL, CODE_PATTERN } from './LobbyCodeField.constants';
import type { LobbyCodeFieldProps } from './LobbyCodeField.type';

const LobbyCodeField = ({ value, onChange, error, disabled }: LobbyCodeFieldProps) => {
  const text = useText();
  return (
    <Field label={text(CODE_LABEL)} error={error}>
      <DynamicInput
        className="lobby-setup__code" pattern={CODE_PATTERN} slots={codeSlotsOf(text)} value={value}
        disabled={disabled} aria-label={text(CODE_LABEL)}
        onChange={onChange}
      />
    </Field>
  );
};

export { LobbyCodeField };
