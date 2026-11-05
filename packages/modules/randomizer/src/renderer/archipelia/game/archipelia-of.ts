/* @layer renderer-shell @kind logic */
import type { ArchipeliaContext } from './archipelia-context.type';
import { registeredArchipelia } from './registered-archipelia';

const archipeliaOf = (): ArchipeliaContext => {
  const context = registeredArchipelia();
  if (context === null) throw new Error('The registered game has no Archipelia support: set archipelago.archipelia on the game.');
  return context;
};

export { archipeliaOf };
