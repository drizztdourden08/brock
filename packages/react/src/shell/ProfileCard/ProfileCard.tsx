/* @layer renderer-shell @kind component */
import { Box, Flex, Icon, IconButton, Pressable, Text } from '@drizztdourden08/tessera/primitives';
import { formatRelativeTime } from '@drizztdourden08/brock-core';
import type { ProfileCardProps } from './ProfileCard.type';
import './ProfileCard.css';

const ProfileCard = (props: ProfileCardProps) => {
  const { profile, subtitle, selected = false, onSelect, onDelete } = props;

  return (
    <Box className={`profile-card${selected ? ' profile-card--selected' : ''}`}>
      <Pressable className="profile-card__select" onClick={() => onSelect(profile)} aria-pressed={selected || undefined}>
        <Flex direction="column" gap="xs" className="profile-card__main">
          <Text className="profile-card__name">{profile.name}</Text>
          {subtitle && <Text className="profile-card__subtitle">{subtitle}</Text>}
        </Flex>
        <Text className="profile-card__date">{formatRelativeTime(profile.lastPlayed)}</Text>
      </Pressable>
      {onDelete && (
        <IconButton variant="danger" size="sm" label={`Delete ${profile.name}`} onClick={() => onDelete(profile)}>
          <Icon name="trash-2" size={14} />
        </IconButton>
      )}
    </Box>
  );
};

export { ProfileCard };
