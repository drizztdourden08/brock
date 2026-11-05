/* @layer core @kind types */
import type { Readings } from './export.type';
import type { HelperRegistry, World, WorldKeys } from '../../world';

interface CallInput<K extends WorldKeys> {
  readings: Readings;
  helpers: HelperRegistry<World<K>>;
}

export type { CallInput };
