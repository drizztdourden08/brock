/* @layer core @kind logic */
import type { ModelFillWorld } from './world-model.type';
import type { WorldKeys } from '../../world';

const forbiddenOf = <K extends WorldKeys>(
  fillWorld: ModelFillWorld<K>, fillable: readonly string[], items: ReadonlySet<string>,
): Record<string, string[]> => {
  const forbidden: Record<string, string[]> = {};
  for (const key of fillable) {
    const allowed = fillWorld.world.getItemRule(key);
    const refused = [...items].filter((item) => !allowed(item)).sort();
    if (refused.length > 0) forbidden[key] = refused;
  }
  return forbidden;
};

export { forbiddenOf };
