/* @layer renderer-shell @kind constants */
import type { SettingLockCause } from '../settings.type';

const noLock = (): SettingLockCause | null => null;

export { noLock };
