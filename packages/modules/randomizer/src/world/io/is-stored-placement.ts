/* @layer core @kind logic */
import type { SchemaSet } from '../types/schema-set.type';
import type { StoredPlacementShape } from './stored-placement-shape.type';
import { schemaRecordOf } from './schema-record-of';

const isStoredPlacement = <S extends StoredPlacementShape = StoredPlacementShape>(
  raw: unknown,
  schemas: SchemaSet,
): raw is S => {
  const candidate = schemaRecordOf(raw, schemas);
  return candidate !== null
    && typeof candidate.locations === 'object' && candidate.locations !== null
    && typeof candidate.stats === 'object' && candidate.stats !== null
    && Array.isArray(candidate.spheres);
};

export { isStoredPlacement };
