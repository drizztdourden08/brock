/* @layer renderer-shell @kind component */
import { Box, Button, Status } from '@drizztdourden08/tessera/primitives';
import { useNow } from '../../../hooks/useNow';
import { useSettingsStore } from '../../../stores/useSettingsStore';
import { SAVED_SHOWN_MS, SAVED_TICK_MS } from '../ScreenSubtitle.constants';

const SettingsSaveStatus = () => {
  const store = useSettingsStore<object>();
  const status = store((s) => s.saveStatus);
  const savedAt = store((s) => s.savedAt);
  const retry = store((s) => s.retrySave);
  const now = useNow(SAVED_TICK_MS, status === 'saved');

  if (status === 'failed') {
    return (
      <Box as="span" className="screen-subtitle__save" role="status">
        <Status tone="danger" dot>Not saved</Status>
        <Button size="sm" variant="ghost" onClick={() => void retry()}>Retry</Button>
      </Box>
    );
  }
  if (status !== 'saved' || savedAt === null || now - savedAt > SAVED_SHOWN_MS) return null;
  return (
    <Box as="span" className="screen-subtitle__save" role="status">
      <Status tone="success" dot>Saved</Status>
    </Box>
  );
};

export { SettingsSaveStatus };
