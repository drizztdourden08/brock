/* @layer renderer-components @kind component */
import { Icon, IconButton, TextInput } from '@drizztdourden08/tessera/primitives';
import { ListItemRow } from '@drizztdourden08/tessera/composites';
import { profileSubtitle } from '../behavior/profile-subtitle';
import { useProfileItemHandlers } from '../behavior/useProfileItemHandlers';
import type { InputProfileItemProps } from './InputProfileItem.type';

const InputProfileItem = (props: InputProfileItemProps) => {
  const { profile, active, editing, editValue, inputRef, labels } = props;
  const h = useProfileItemHandlers(props);
  const icon = <Icon name={profile.deviceType === 'keyboard' ? 'keyboard' : 'gamepad-2'} />;

  if (editing) {
    const field = (
      <TextInput
        ref={inputRef}
        value={editValue}
        onChange={h.handleChange}
        onBlur={h.handleCommit}
        onKeyDown={h.handleKeyDown}
        aria-label={labels.profileName}
      />
    );
    return <ListItemRow icon={icon} name={field} selected={active} />;
  }

  const actions = (
    <>
      <IconButton variant="ghost" size="xs" label={labels.renameProfile} onClick={h.handleEditClick}>
        <Icon name="pencil" />
      </IconButton>
      {!profile.isDefault && (
        <IconButton variant="ghost" size="xs" label={labels.deleteProfile} onClick={h.handleDeleteClick}>
          <Icon name="x" />
        </IconButton>
      )}
    </>
  );

  return (
    <ListItemRow
      icon={icon}
      name={profile.name}
      meta={profileSubtitle(profile, labels)}
      selected={active}
      onClick={h.handleSelect}
      onDoubleClick={h.handleStartEditing}
      action={actions}
      actionVisibility="hover"
      data={{ 'data-profile-id': profile.id }}
    />
  );
};

export { InputProfileItem };
