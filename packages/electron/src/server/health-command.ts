/* @layer electron-main @kind logic */
import { HEALTH_MAX_AGE_MS } from './health-file.constants';
import type { HealthCommandInput } from './health-command.type';
import { readHealthFile } from './read-health-file';

const runHealthCommand = ({ dataDir, now, print }: HealthCommandInput): number => {
  const record = readHealthFile(dataDir);
  if (record === null) {
    print('unhealthy: no readable health file');
    return 1;
  }
  if (Math.abs(now - record.at) > HEALTH_MAX_AGE_MS) {
    print('unhealthy: the heartbeat is stale');
    return 1;
  }
  if (!record.ok) {
    print('unhealthy: the server reports a fault');
    return 1;
  }
  print('healthy');
  return 0;
};

export { runHealthCommand };
