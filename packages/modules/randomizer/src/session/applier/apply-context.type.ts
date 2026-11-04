/* @layer core @kind types */
import type { RandomizerLog } from '../../contract/randomizer-log.type';
import type { ForeignItem } from './foreign-item.type';

type ApplyContext = {
  tag: string;
  reportCheck(key: string): void;
  suppress(key: string): void;
  log: RandomizerLog;
  foreign?(locationKey: string): ForeignItem | undefined;
};

export type { ApplyContext };
