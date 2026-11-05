/* @layer renderer-shell @kind component */
import { Box, Icon, Text } from '@drizztdourden08/tessera/primitives';
import type { ControllerDisconnectOverlayProps } from './ControllerDisconnectOverlay.type';
import './ControllerDisconnectOverlay.css';

const ControllerDisconnectOverlay = (props: ControllerDisconnectOverlayProps) => {
  const { controllerName, canSwitchProfile, onResume, resumeGlyph, prevGlyph, nextGlyph } = props;
  const showSwitch = canSwitchProfile && prevGlyph != null && nextGlyph != null;

  return (
    <Box className="controller-disconnect-overlay" onDoubleClick={onResume}>
      <Box className="controller-disconnect-overlay__card">
        <Box className="controller-disconnect-overlay__icon">
          <Icon name="gamepad-2" />
        </Box>
        <Text as="h2" className="controller-disconnect-overlay__title">Controller Disconnected</Text>
        <Text as="p" className="controller-disconnect-overlay__message">
          <Text as="strong">{controllerName}</Text> is not connected.
        </Text>
        <Box className="controller-disconnect-overlay__actions">
          <Text as="p">Reconnect it to continue, or:</Text>
          <Box className="controller-disconnect-overlay__option">
            <Text>Double-click here to resume</Text>
          </Box>
          {resumeGlyph != null && (
            <Box className="controller-disconnect-overlay__option">
              {resumeGlyph}
              <Text>Resume</Text>
            </Box>
          )}
          {showSwitch && (
            <Box className="controller-disconnect-overlay__option">
              {prevGlyph}{nextGlyph}
              <Text>Switch input profile</Text>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export { ControllerDisconnectOverlay };
