/* @layer renderer-shell @kind hook */
import { useBrock } from '../../../app/useBrock';
import type { SettingLockCause } from '../../settings.type';
import { noLock } from '../no-lock.constants';

const useLockCauseOf = (): ((key: string, settings: object) => SettingLockCause | null) => {
  const { settingsControls } = useBrock();
  return settingsControls.lockCauseOf ?? noLock;
};

export { useLockCauseOf };
