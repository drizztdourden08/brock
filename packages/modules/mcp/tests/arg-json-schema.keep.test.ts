/* @layer core @kind test */
import { describe, expect, it } from 'vitest';
import { argJsonSchema } from '../src/arg-json-schema';
import { BUILT_IN_TOOLS } from '../src/built-in-tools.constants';
import { toolInfoOf } from '../src/tool-info-of';

describe('K2 the JSON Schema of an ArgSchema', { tags: ['critical'] }, () => {
  it('maps types, labels, options and ranges', () => {
    const schema = argJsonSchema({
      id: { type: 'string', label: 'Widget id' },
      action: { type: 'string', optional: true, options: [{ value: 'open', label: 'Open' }, { value: 'close', label: 'Close' }] },
      count: { type: 'number', min: 1, max: 2, optional: true },
      settle: { type: 'boolean', optional: true },
    });
    expect(schema).toEqual({
      type: 'object',
      properties: {
        id: { type: 'string', description: 'Widget id' },
        action: { type: 'string', enum: ['open', 'close'] },
        count: { type: 'number', minimum: 1, maximum: 2 },
        settle: { type: 'boolean' },
      },
      required: ['id'],
      additionalProperties: false,
    });
  });

  it('gives an empty schema for no arguments', () => {
    expect(argJsonSchema({})).toEqual({ type: 'object', properties: {}, required: [], additionalProperties: false });
  });

  it('describes all eleven built-ins with valid names and a schema', () => {
    expect(BUILT_IN_TOOLS).toHaveLength(11);
    for (const spec of BUILT_IN_TOOLS) {
      const info = toolInfoOf(spec);
      expect(spec.name).toMatch(/^[a-z][a-z0-9_]{1,47}$/);
      expect(info.inputSchema.additionalProperties).toBe(false);
      expect(info.description.length).toBeGreaterThan(0);
    }
    expect(new Set(BUILT_IN_TOOLS.map((spec) => spec.name)).size).toBe(11);
  });
});
