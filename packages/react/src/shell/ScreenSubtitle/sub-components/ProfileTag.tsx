/* @layer renderer-shell @kind component */
import { Tag } from '@drizztdourden08/tessera/primitives';
import { useProfilesStore } from '../../../stores/useProfilesStore';

const ProfileTag = () => {
  const name = useProfilesStore((s) => s.active?.name ?? null);
  const several = useProfilesStore((s) => s.profiles.length > 1);
  if (name === null || !several) return null;
  return <Tag className="screen-subtitle__profile" title="Active profile">{name}</Tag>;
};

export { ProfileTag };
