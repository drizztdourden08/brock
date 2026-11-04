/* @layer core @kind constants */
const MCP_ROUTE = {
  hello: 'brock:mcp:hello',
  tools: 'brock:mcp:tools',
  call: 'brock:mcp:call',
  toolsChanged: 'brock:mcp:tools-changed',
} as const;

const MCP_RENDERER_CHANNEL = {
  list: 'mcp:renderer:list',
  call: 'mcp:renderer:call',
  toolsChanged: 'mcp:tools-changed',
} as const;

const MCP_ERROR = {
  unknownTool: 'unknown-tool',
  invalidArguments: 'invalid-arguments',
  noWindow: 'no-window',
  timeout: 'timeout',
  failed: 'failed',
  appDown: 'app-down',
} as const;

const MCP_TOOL_NAME_REGEX = /^[a-z][a-z0-9_]{1,47}$/;
const MCP_SCREENSHOT_NAME_REGEX = /^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/;

const MCP_TIMEOUT_MS = {
  hello: 5_000,
  rendererAsk: 15_000,
  captureHolds: 5_000,
  call: 30_000,
} as const;

const MCP_BRIDGE_LIMITS = {
  maxMessageBytes: 8 * 1024 * 1024,
  maxBufferedBytes: 16 * 1024 * 1024,
} as const;

const MCP_SCREENSHOTS_DIR = 'screenshots/mcp';
const MCP_TYPE_TEXT_MAX_CHARS = 2000;
const MCP_PROTOCOL_VERSION = 1;
const MCP_OK_TEXT = 'ok';
const MCP_ENVELOPE_KEYS: readonly string[] = ['text', 'data', 'images', 'isError'];

export {
  MCP_OK_TEXT, MCP_ENVELOPE_KEYS,
  MCP_ROUTE, MCP_RENDERER_CHANNEL, MCP_ERROR, MCP_TOOL_NAME_REGEX, MCP_SCREENSHOT_NAME_REGEX,
  MCP_TIMEOUT_MS, MCP_BRIDGE_LIMITS,
  MCP_SCREENSHOTS_DIR, MCP_TYPE_TEXT_MAX_CHARS, MCP_PROTOCOL_VERSION,
};
