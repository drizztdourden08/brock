/* @layer renderer-shell @kind logic */
import type { SearchEntrySeed } from './search.type';

const seedEntryId = (route: string, seed: SearchEntrySeed): string => `entry:${route}#${seed.id ?? seed.anchor ?? (typeof seed.label === 'string' ? seed.label : seed.label.key)}`;

export { seedEntryId };
