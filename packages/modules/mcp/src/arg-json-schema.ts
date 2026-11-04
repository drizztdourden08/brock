/* @layer core @kind logic */
import type { ArgField, ArgSchema } from '@drizztdourden08/brock-core/args';
import type { McpJsonProperty, McpJsonSchema } from './mcp.type';

const propertyOf = (field: ArgField): McpJsonProperty => ({
  type: field.type,
  ...(field.label !== undefined ? { description: field.label } : {}),
  ...(field.options !== undefined ? { enum: field.options.map((option) => option.value) } : {}),
  ...(field.type === 'number' && field.min !== undefined ? { minimum: field.min } : {}),
  ...(field.type === 'number' && field.max !== undefined ? { maximum: field.max } : {}),
});

const argJsonSchema = (schema: ArgSchema): McpJsonSchema => {
  const entries = Object.entries(schema);
  return {
    type: 'object',
    properties: Object.fromEntries(entries.map(([name, field]) => [name, propertyOf(field)])),
    required: entries.filter(([, field]) => field.optional !== true).map(([name]) => name),
    additionalProperties: false,
  };
};

export { argJsonSchema };
