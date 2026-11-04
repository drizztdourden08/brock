/* @layer core @kind types */
import type { ArmedSeed } from './armed-seed.type';

type ApplyResult<A> =
  | { ok: true; armed: ArmedSeed<A> }
  | { ok: false; refusal: string; counts?: Record<string, number> };

export type { ApplyResult };
