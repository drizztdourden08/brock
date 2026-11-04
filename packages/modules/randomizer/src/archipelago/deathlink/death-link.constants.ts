/* @layer core @kind constants */
import type { LinkKill } from '../client/online-host.type';

const DEATH_LINK_GUARD_MS = 5000;
const MS_PER_SECOND = 1000;

const KILL_LOG_NOTE: Record<LinkKill, string> = {
  armed: '',
  down: ' (already down)',
  unsupported: ' (this core cannot kill Link)',
};

export { DEATH_LINK_GUARD_MS, KILL_LOG_NOTE, MS_PER_SECOND };
