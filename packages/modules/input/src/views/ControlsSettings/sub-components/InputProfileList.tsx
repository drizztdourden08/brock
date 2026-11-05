/* @layer renderer-components @kind component */
import { EmptyState } from '@drizztdourden08/tessera/primitives';
import { useProfileEditing } from '../behavior/useProfileEditing';
import { InputProfileItem } from './InputProfileItem';
import type { InputProfileListProps } from './InputProfileList.type';

const InputProfileList = (props: InputProfileListProps) => {
  const { profiles, activeId, initialEditId, labels, onSelect, onDelete, onRename } = props;
  const { editingId, editValue, inputRef, setEditValue, startEditing, commitEdit, cancelEdit } =
    useProfileEditing({ profiles, initialEditId, onRename });

  if (profiles.length === 0) return <EmptyState message={labels.noProfiles} />;

  return profiles.map((profile) => (
    <InputProfileItem
      key={profile.id}
      profile={profile}
      active={profile.id === activeId}
      editing={editingId === profile.id}
      editValue={editValue}
      inputRef={inputRef}
      labels={labels}
      onSelect={onSelect}
      onDelete={onDelete}
      onStartEditing={startEditing}
      onCommitEdit={commitEdit}
      onCancelEdit={cancelEdit}
      onEditValueChange={setEditValue}
    />
  ));
};

export { InputProfileList };
