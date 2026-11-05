/* @layer core @kind logic */
import { fnv1a } from './fnv1a';

const spriteDigestOf = (names: readonly string[]): string => `${names.length}-${fnv1a([...names].sort().join('\n'))}`;

export { spriteDigestOf };
