/* @layer electron-main @kind types */
import type { AppServices } from '@drizztdourden08/brock-core/augment';

interface ServicesState {
  value: AppServices | null;
  missing: string;
}

export type { ServicesState };
