/* @layer renderer-shell @kind component */
import { Box, Card, Flex, Shortcut, Stack, Status, Text } from '@drizztdourden08/tessera/primitives';
import { WINDOW_GROUP_TEXT, WINDOW_GUIDE_HINTS } from '../window-groups.constants';
import type { WindowGuideOverlayProps } from './WindowGuideOverlay.type';
import './WindowGuideOverlay.css';

const WindowGuideOverlay = (props: WindowGuideOverlayProps) => {
  const { open, mode, snapping, hints = WINDOW_GUIDE_HINTS } = props;
  if (!open) return null;

  return (
    <Box className="window-guide" data-window-guide={mode} data-snapping={snapping ? 'on' : 'off'}>
      <Card className="window-guide__card">
        <Stack gap="md">
          <Flex gap="sm" align="center" justify="between">
            <Text variant="title">{mode === 'moving' ? WINDOW_GROUP_TEXT.moving : WINDOW_GROUP_TEXT.resizing}</Text>
            <Status tone={snapping ? 'success' : 'warning'}>{snapping ? WINDOW_GROUP_TEXT.snapOn : WINDOW_GROUP_TEXT.snapOff}</Status>
          </Flex>
          <Stack gap="sm">
            {hints.map((hint) => (
              <Flex key={hint.text} gap="sm" align="center">
                {hint.keys && <Shortcut keys={hint.keys} size="xs" />}
                <Text variant="body">{hint.text}</Text>
              </Flex>
            ))}
          </Stack>
        </Stack>
      </Card>
    </Box>
  );
};

export { WindowGuideOverlay };
