/* @layer core @kind types */
import type { DefPlacement, WorldKeys } from '../../world';
import type { TrackerProvider } from './tracker-provider.type';

type DefTrackerExtras<K extends WorldKeys> = Omit<TrackerProvider<DefPlacement<K>>, 'world' | 'worldKey' | 'vanilla' | 'sphereOf'>;

export type { DefTrackerExtras };
