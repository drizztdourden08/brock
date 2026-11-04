/* @layer core @kind logic */
import type { SchemaSet } from '../types/schema-set.type';
import { schemaMatches } from './schema-matches';

const schemaRecordOf = (raw: unknown, schemas: SchemaSet): Record<string, unknown> | null => {
  if (!raw || typeof raw !== 'object') return null;
  const candidate = raw as Record<string, unknown>;
  return schemaMatches(candidate.schema, schemas) ? candidate : null;
};

export { schemaRecordOf };
