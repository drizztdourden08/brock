/* @layer electron-main @kind types */
import type { DocumentEntry } from '@drizztdourden08/brock-core/platform';
import type { ListLimits } from './list-limits.type';
import type { ListSettings } from './list-options.type';

interface ListWalk {
  settings: ListSettings;
  limits: ListLimits;
  covers: (real: string) => boolean;
  live: () => boolean;
  deadline: number;
  seen: number;
  found: DocumentEntry[];
  truncated: boolean;
}

export type { ListWalk };
