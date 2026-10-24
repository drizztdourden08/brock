/* @layer electron-main @kind logic */
import { HEARTBEAT_MS } from './health-file.constants';
import { removeHealthFile } from './remove-health-file';
import type { Heartbeat, HeartbeatInput } from './start-heartbeat.type';
import { writeHealthFile } from './write-health-file';

const isHealthy = async (health: HeartbeatInput['health']): Promise<boolean> => {
  if (!health) return true;
  try {
    return await health();
  } catch {
    return false;
  }
};

const startHeartbeat = async ({ dataDir, health, log, now = Date.now, intervalMs = HEARTBEAT_MS }: HeartbeatInput): Promise<Heartbeat> => {
  let failing = false;
  const beat = async (): Promise<void> => {
    const ok = await isHealthy(health);
    try {
      writeHealthFile(dataDir, { ok, pid: process.pid, at: now() });
      failing = false;
    } catch (error) {
      if (!failing) log(`the health file cannot be written: ${String(error)}`, 'warn');
      failing = true;
    }
  };
  await beat();
  const timer = setInterval(() => void beat(), intervalMs);
  timer.unref();
  return {
    stop: () => {
      clearInterval(timer);
      removeHealthFile(dataDir);
    },
  };
};

export { startHeartbeat };
