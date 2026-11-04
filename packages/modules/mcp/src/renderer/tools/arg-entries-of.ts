/* @layer renderer-shell @kind logic */
import type { ArgField, ArgSchema } from '@drizztdourden08/brock-core/args';
import type { McpData } from '../../mcp.type';

const fieldEntryOf = (field: ArgField): McpData => ({
  type: field.type,
  optional: field.optional === true,
  ...(field.label !== undefined ? { label: field.label } : {}),
  ...(field.options !== undefined ? { options: field.options.map((option) => option.value) } : {}),
  ...(field.min !== undefined ? { min: field.min } : {}),
  ...(field.max !== undefined ? { max: field.max } : {}),
});

const argEntriesOf = (schema: ArgSchema | undefined): McpData =>
  Object.fromEntries(Object.entries(schema ?? {}).map(([name, field]) => [name, fieldEntryOf(field)]));

export { argEntriesOf };
