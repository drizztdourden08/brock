/* @layer renderer-shell @kind logic */
import { msg } from '@drizztdourden08/brock-core/i18n';
import type { Text } from '@drizztdourden08/brock-core/i18n';
import type { PickScope } from '../../palette.type';
import { stepScope } from '../../step-scope';

const scopePlaceholder = (scopes: readonly PickScope[], current: string | null, active: PickScope | undefined, text: (value: Text) => string): string | undefined => {
  if (active === undefined) return undefined;
  const next = stepScope(scopes, current, 1);
  const search = text(msg('brock-app:palette.scope.search', { label: active.label }));
  return next === undefined || next.id === active.id ? search : `${search}, ${text(msg('brock-app:palette.scope.next', { label: next.label }))}`;
};

export { scopePlaceholder };
