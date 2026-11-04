/* @layer core @kind logic */
import type { SchemaSet } from '../types/schema-set.type';
import type { StoredPlacementShape } from './stored-placement-shape.type';
import { schemaMatches } from './schema-matches';

const isStoredPlacement = <S extends StoredPlacementShape = StoredPlacementShape>(
  raw: unknown,
  schemas: SchemaSet,
): raw is S => {
  if (!raw || typeof raw !== 'object') return false;
  const candidate = raw as Record<string, unknown>;
  return schemaMatches(candidate.schema, schemas)
    && typeof candidate.locations === 'object' && candidate.locations !== null
    && typeof candidate.stats === 'object' && candidate.stats !== null
    && Array.isArray(candidate.spheres);
};

export { isStoredPlacement };
