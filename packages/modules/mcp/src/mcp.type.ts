/* @layer core @kind types */
import type { ArgSchema, ArgValue } from '@drizztdourden08/brock-core/args';
import type { JsonValue } from '@drizztdourden08/brock-core/ipc';
import type { MCP_ERROR } from './mcp.constants';

interface McpModuleOptions {
  dev?: boolean;
  packaged?: boolean;
}

type McpErrorCode = (typeof MCP_ERROR)[keyof typeof MCP_ERROR];

type McpArgs = Readonly<Record<string, ArgValue | undefined>>;

interface McpImage {
  data: string;
  mimeType: string;
}

type McpData = Record<string, JsonValue>;

interface McpToolResult {
  text: string;
  data?: McpData;
  images: McpImage[];
  isError: boolean;
}

interface McpReplyEnvelope {
  text?: string;
  data?: McpData;
  images?: McpImage[];
  isError?: boolean;
}

type McpReply = string | JsonValue | McpReplyEnvelope | void;

interface McpCallContext {
  name: string;
  signal: AbortSignal;
}

interface McpToolDescriptor {
  name: string;
  title?: string;
  description: string;
  args?: ArgSchema;
  readOnly?: boolean;
  destructive?: boolean;
}

interface McpToolDef extends McpToolDescriptor {
  run: (args: McpArgs, call: McpCallContext) => McpReply | Promise<McpReply>;
}

type McpToolSide = 'main' | 'renderer';

interface McpBuiltInSpec extends McpToolDescriptor {
  side: McpToolSide;
  args: ArgSchema;
  title: string;
  readOnly: boolean;
  destructive: boolean;
}

interface McpJsonProperty {
  type: 'string' | 'number' | 'boolean';
  description?: string;
  enum?: ArgValue[];
  minimum?: number;
  maximum?: number;
}

interface McpJsonSchema {
  type: 'object';
  properties: Record<string, McpJsonProperty>;
  required: string[];
  additionalProperties: false;
}

interface McpToolInfo {
  name: string;
  title: string;
  description: string;
  inputSchema: McpJsonSchema;
  readOnly: boolean;
  destructive: boolean;
}

interface McpApi {
  toolsChanged: () => void;
}

interface McpEnabledInput {
  isPackaged: boolean;
  options: McpModuleOptions | undefined;
}

interface McpToolRegistry {
  register: (def: McpToolDef) => () => void;
  get: (name: string) => McpToolDef | undefined;
  list: () => McpToolInfo[];
  onChange: (listener: () => void) => () => void;
}

interface McpSerialQueue {
  run: <T>(job: () => T | Promise<T>) => Promise<T>;
  pending: () => number;
}

export type {
  McpModuleOptions, McpErrorCode, McpArgs, McpImage, McpData, McpToolResult, McpReplyEnvelope, McpReply,
  McpCallContext, McpToolDescriptor, McpToolDef, McpToolSide, McpBuiltInSpec, McpJsonProperty,
  McpJsonSchema, McpToolInfo, McpApi, McpEnabledInput, McpToolRegistry, McpSerialQueue,
};
