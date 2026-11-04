/* @layer core @kind logic */
import type { SchemaSet } from '../types/schema-set.type';
import type { OptionsSnapshotShape } from './options-snapshot-shape.type';
import { schemaMatches } from './schema-matches';

const isOptionsSnapshot = <S extends OptionsSnapshotShape = OptionsSnapshotShape>(
  raw: unknown,
  schemas: SchemaSet,
): raw is S => {
  if (!raw || typeof raw !== 'object') return false;
  const candidate = raw as Record<string, unknown>;
  return schemaMatches(candidate.schema, schemas)
    && typeof candidate.values === 'object' && candidate.values !== null;
};

export { isOptionsSnapshot };
