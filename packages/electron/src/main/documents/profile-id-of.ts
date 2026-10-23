/* @layer electron-main @kind logic */
import { assertSafeName } from '@drizztdourden08/brock-core/storage';

const profileIdOf = (value: unknown): string => {
  if (typeof value !== 'string') throw new Error('A document call needs a profile id');
  return assertSafeName(value, 'profile id');
};

export { profileIdOf };
