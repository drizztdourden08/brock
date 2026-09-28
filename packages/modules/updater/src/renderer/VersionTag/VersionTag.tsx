/* @layer renderer-shell @kind component */
import { Pressable, Text } from '@drizztdourden08/tessera/primitives';
import { useVersionTag } from './behavior/useVersionTag';
import './VersionTag.css';

const VersionTag = () => {
  const { label, hasUpdate, title, onOpen } = useVersionTag();
  if (!label) return null;

  return (
    <Pressable className={hasUpdate ? 'version-tag version-tag--update' : 'version-tag'} title={title} aria-label={title} onClick={onOpen}>
      <Text className="version-tag__label">{label}</Text>
      {hasUpdate && <Text className="version-tag__badge" aria-hidden="true" />}
    </Pressable>
  );
};

VersionTag.displayName = 'VersionTag';

export { VersionTag };
