/* @layer core @kind types */
import type { CreateProfileOptions } from '@drizztdourden08/brock-core';

type RollContext = { profileId?: string; create?: CreateProfileOptions; onProgress?(fraction: number | null): void };

export type { RollContext };
