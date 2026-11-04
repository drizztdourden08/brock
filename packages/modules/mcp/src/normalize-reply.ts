/* @layer core @kind logic */
import type { McpData, McpReply, McpReplyEnvelope, McpToolResult } from './mcp.type';
import { isReplyEnvelope } from './is-reply-envelope';
import { MCP_OK_TEXT } from './mcp.constants';

const jsonText = (value: unknown): string | null => {
  try {
    const text: unknown = JSON.stringify(value);
    return typeof text === 'string' ? text : 'null';
  } catch {
    return null;
  }
};

const dataOf = (value: unknown): McpData | undefined => (
  value !== null && typeof value === 'object' && !Array.isArray(value) ? (value as McpData) : undefined
);

const failure = (): McpToolResult => ({ text: 'The tool reply cannot be written as JSON.', images: [], isError: true });

const fromEnvelope = (envelope: McpReplyEnvelope): McpToolResult => {
  const text = envelope.text ?? (envelope.data === undefined ? '' : jsonText(envelope.data));
  if (text === null) return failure();
  return {
    text,
    ...(envelope.data !== undefined ? { data: envelope.data } : {}),
    images: envelope.images ?? [],
    isError: envelope.isError === true,
  };
};

const fromJson = (reply: unknown): McpToolResult => {
  const text = jsonText(reply);
  if (text === null) return failure();
  const data = dataOf(reply);
  return { text, ...(data !== undefined ? { data } : {}), images: [], isError: false };
};

const normalizeReply = (reply: McpReply): McpToolResult => {
  if (typeof reply === 'string') return { text: reply, images: [], isError: false };
  if (reply === undefined) return { text: MCP_OK_TEXT, images: [], isError: false };
  return isReplyEnvelope(reply) ? fromEnvelope(reply) : fromJson(reply);
};

export { normalizeReply };
