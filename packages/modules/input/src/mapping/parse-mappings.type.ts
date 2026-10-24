/* @layer core @kind types */
import type { MappingSource } from './mapping-entry.type';

type SourceOf = (guid: string, platform: string | undefined) => MappingSource;

export type { SourceOf };
