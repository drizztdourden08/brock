/* @layer core @kind types */
import type { CreateProfileOptions } from '@drizztdourden08/brock-core';
import type { RandomizerConnectionValues, RandomizerModeId } from '../augment';

type RollContext = {
  profileId?: string;
  create?: CreateProfileOptions;
  mode?: RandomizerModeId;
  connection?: RandomizerConnectionValues;
  onProgress?(fraction: number | null): void;
};

export type { RollContext };
