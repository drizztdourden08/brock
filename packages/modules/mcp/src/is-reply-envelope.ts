/* @layer core @kind logic */
import type { McpReplyEnvelope } from './mcp.type';
import { MCP_ENVELOPE_KEYS } from './mcp.constants';

const isRecord = (value: unknown): value is Record<string, unknown> => value !== null && typeof value === 'object' && !Array.isArray(value);

const isImage = (value: unknown): boolean => isRecord(value) && typeof value.data === 'string' && typeof value.mimeType === 'string';

const partsFit = (value: Record<string, unknown>): boolean => (
  (value.text === undefined || typeof value.text === 'string')
  && (value.isError === undefined || typeof value.isError === 'boolean')
  && (value.data === undefined || isRecord(value.data))
  && (value.images === undefined || (Array.isArray(value.images) && value.images.every(isImage)))
);

const isReplyEnvelope = (value: unknown): value is McpReplyEnvelope => {
  if (!isRecord(value)) return false;
  const keys = Object.keys(value);
  return keys.length > 0 && keys.every((key) => MCP_ENVELOPE_KEYS.includes(key)) && partsFit(value);
};

export { isReplyEnvelope };
