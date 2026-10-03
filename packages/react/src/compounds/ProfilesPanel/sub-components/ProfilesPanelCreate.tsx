/* @layer renderer-shell @kind component */
import { InlineCreateForm } from '@drizztdourden08/tessera/composites';
import { Button, SectionHeader } from '@drizztdourden08/tessera/primitives';
import { PROFILES_PANEL_TEXT } from '../ProfilesPanel.constants';
import type { ProfilesPanelCreateProps } from './ProfilesPanelCreate.type';

const ProfilesPanelCreate = (props: ProfilesPanelCreateProps) => {
  const {
    title, canCreate, formShown, createOpen, error, extraFields, canSubmit, placeholder = PROFILES_PANEL_TEXT.placeholder,
    newLabel = PROFILES_PANEL_TEXT.newProfile, onOpen, onSubmit, onCancel,
  } = props;
  const newButton = canCreate && !formShown ? <Button variant="primary" size="sm" onClick={onOpen}>{newLabel}</Button> : undefined;

  return (
    <>
      <SectionHeader title={title} action={newButton} />
      {formShown && (
        <InlineCreateForm
          placeholder={placeholder}
          onCreate={onSubmit}
          onCancel={createOpen ? undefined : onCancel}
          extraFields={extraFields}
          canSubmit={canSubmit}
          error={error}
        />
      )}
    </>
  );
};

export { ProfilesPanelCreate };
