/* @layer renderer-components @kind component */
import { InputProfileList } from './InputProfileList';
import type { ProfilesBodyProps } from './ProfilesBody.type';

const ProfilesBody = (props: ProfilesBodyProps) => {
  const { profiles, activeId, newlyCreatedId, labels, onSelect, onDelete, onRename } = props;
  return (
    <InputProfileList
      profiles={profiles}
      activeId={activeId}
      initialEditId={newlyCreatedId}
      labels={labels}
      onSelect={onSelect}
      onDelete={onDelete}
      onRename={onRename}
    />
  );
};

export { ProfilesBody };
