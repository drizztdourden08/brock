/* @layer core @kind logic */
import type { SchemaSet } from '../types/schema-set.type';

const schemaMatches = (schema: unknown, schemas: SchemaSet): boolean =>
  schema === schemas.current || (typeof schema === 'string' && (schemas.legacy ?? []).includes(schema));

export { schemaMatches };
