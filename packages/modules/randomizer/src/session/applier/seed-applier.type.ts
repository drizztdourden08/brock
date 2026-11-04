/* @layer core @kind types */
import type { ApplyContext } from './apply-context.type';
import type { ApplyResult } from './apply-result.type';

interface SeedApplier<P, A> {
  apply(placement: P, ctx: ApplyContext): Promise<ApplyResult<A>>;
  revert(): void | Promise<void>;
}

export type { SeedApplier };
