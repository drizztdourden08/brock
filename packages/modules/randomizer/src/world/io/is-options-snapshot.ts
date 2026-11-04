/* @layer core @kind logic */
import type { SchemaSet } from '../types/schema-set.type';
import type { OptionsSnapshotShape } from './options-snapshot-shape.type';
import { schemaRecordOf } from './schema-record-of';

const isOptionsSnapshot = <S extends OptionsSnapshotShape = OptionsSnapshotShape>(
  raw: unknown,
  schemas: SchemaSet,
): raw is S => {
  const candidate = schemaRecordOf(raw, schemas);
  return candidate !== null
    && 
};

export { isOptionsSnapshot };
