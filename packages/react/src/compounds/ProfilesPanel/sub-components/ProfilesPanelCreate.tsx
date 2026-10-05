/* @layer renderer-shell @kind component */
import { InlineCreateForm } from '@drizztdourden08/tessera/composites';
import type { ProfilesPanelCreateProps } from './ProfilesPanelCreate.type';

const ProfilesPanelCreate = (props: ProfilesPanelCreateProps) => {
  const { close, required, error, extraFields, canSubmit, placeholder, onSubmit } = props;

  return (
    <InlineCreateForm
      placeholder={placeholder}
      onCreate={(name) => onSubmit(name, close)}
      onCancel={required ? undefined : close}
      extraFields={extraFields}
      canSubmit={canSubmit}
      error={error}
    />
  );
};

export { ProfilesPanelCreate };
