/* @layer electron-main @kind logic */
import { createHash } from 'crypto';
import { resolve } from 'path';

const bridgeKeyOf = (instanceName: string | null, userDataOverride: string | null): string | null => {
  if (instanceName) return instanceName;
  if (!userDataOverride) return null;
  return `data-${createHash('sha256').update(resolve(userDataOverride).toLowerCase()).digest('hex').slice(0, 12)}`;
};

export { bridgeKeyOf };
