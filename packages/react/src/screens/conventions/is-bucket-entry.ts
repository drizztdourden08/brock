/* @layer renderer-shell @kind logic */
import type { BucketEntry, ScreenEntry } from './screen-tree.type';

const isBucketEntry = (entry: ScreenEntry): entry is BucketEntry => 'bucket' in entry;

export { isBucketEntry };
