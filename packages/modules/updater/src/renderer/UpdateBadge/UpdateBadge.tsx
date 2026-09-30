/* @layer renderer-shell @kind component */
import { Pressable } from '@drizztdourden08/tessera/primitives';
import { useUpdateBadge } from './behavior/useUpdateBadge';
import './UpdateBadge.css';

const UpdateBadge = () => {
  const { shown, onOpen } = useUpdateBadge();
  if (!shown) return null;

  return (
    <Pressable className="titlebar__update-badge" onClick={onOpen}>
      Update available
    </Pressable>
  );
};

UpdateBadge.displayName = 'UpdateBadge';
UpdateBadge.conditional = true;

export { UpdateBadge };
