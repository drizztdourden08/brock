/* @layer core @kind types */
import type { RandomizerLog } from '../../contract/randomizer-log.type';

type ApplyContext = {
  tag: string;
  reportCheck: (key: string) => void;
  suppress: (key: string) => void;
  log: RandomizerLog;
};

export type { ApplyContext };
