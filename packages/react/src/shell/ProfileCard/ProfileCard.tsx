/* @layer renderer-shell @kind component */
import { Flex, Icon, IconButton, Pressable, Text } from '@drizztdourden08/tessera/primitives';
import { formatRelativeTime } from '@drizztdourden08/brock-core';
import type { ProfileCardProps } from './ProfileCard.type';
import './ProfileCard.css';

const ProfileCard = (props: ProfileCardProps) => {
  const { profile, subtitle, selected = false, onSelect, onDelete } = props;

  return (
    <Pressable
      className={`profile-card${selected ? ' profile-card--selected' : ''}`}
      onClick={() => onSelect(profile)}
      aria-pressed={selected || undefined}
    >
      <Flex direction="column" gap="xs" className="profile-card__main">
        <Text className="profile-card__name">{profile.name}</Text>
        {subtitle && <Text className="profile-card__subtitle">{subtitle}</Text>}
      </Flex>
      <Flex align="center" gap="sm" className="profile-card__meta">
        <Text className="profile-card__date">{formatRelativeTime(profile.lastPlayed)}</Text>
        {onDelete && (
          <IconButton
            variant="danger"
            label={`Delete ${profile.name}`}
            onClick={(e) => { e.stopPropagation(); onDelete(profile); }}
          >
            <Icon name="trash-2" size={14} />
          </IconButton>
        )}
      </Flex>
    </Pressable>
  );
};

export { ProfileCard };
