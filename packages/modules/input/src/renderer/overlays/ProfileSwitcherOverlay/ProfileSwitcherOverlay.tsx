/* @layer renderer-shell @kind component */
import { Box, Icon, Text } from '@drizztdourden08/tessera/primitives';
import type { ProfileSwitcherOverlayProps } from './ProfileSwitcherOverlay.type';
import './ProfileSwitcherOverlay.css';

const ProfileSwitcherOverlay = (props: ProfileSwitcherOverlayProps) => {
  const { open, profiles, activeId, prevGlyph, nextGlyph } = props;
  const hasHint = prevGlyph != null || nextGlyph != null;

  return (
    <Box className={`profile-switcher ${open ? 'profile-switcher--open' : ''}`}>
      <Text className="profile-switcher__title">Input Profile</Text>
      <Box className="profile-switcher__list">
        {profiles.map((p) => (
          <Box
            key={p.id}
            className={`profile-switcher__item ${p.id === activeId ? 'profile-switcher__item--active' : ''}`}
          >
            <Text className="profile-switcher__item-icon">
              <Icon name={p.deviceType === 'keyboard' ? 'keyboard' : 'gamepad-2'} />
            </Text>
            <Text className="profile-switcher__item-name">{p.name}</Text>
          </Box>
        ))}
      </Box>
      {hasHint && (
        <Box className="profile-switcher__hint">
          {prevGlyph}{nextGlyph}
          <Text className="profile-switcher__hint-label">Switch</Text>
        </Box>
      )}
    </Box>
  );
};

export { ProfileSwitcherOverlay };
