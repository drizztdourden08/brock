/* @layer renderer-app @kind types */
import type { EventContract, InvokeContract, SendContract } from '@drizztdourden08/brock-core/augment';

declare module '@drizztdourden08/brock-core/augment' {
  interface InvokeContract {}
}

export type { EventContract, InvokeContract, SendContract };
