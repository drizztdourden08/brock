/* @layer renderer-shell @kind logic */
import type { SearchEntrySeed } from './search.type';

const seedEntryId = (route: string, seed: SearchEntrySeed): string => `entry:${route}#${seed.id ?? seed.anchor ?? seed.label}`;

export { seedEntryId };
