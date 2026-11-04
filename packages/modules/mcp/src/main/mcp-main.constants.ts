/* @layer electron-main @kind constants */
const MCP_MODULE_ID = 'mcp';
const MCP_LOG_UNKNOWN_NAME = '?';
const MCP_CALL_NAME_MAX_CHARS = 64;
const MCP_HELPER_TOOL_NAMES: readonly string[] = ['select_app'];
const MCP_ASK_TIMED_OUT = /timed out/;
const MCP_ASK_WINDOW_GONE = /window (is )?closed|closed before/;

const MCP_MESSAGE = {
  noWindow: 'The app has no window open.',
  timeout: 'The window did not answer in time.',
  badKey: 'The key or chord is not known.',
  badName: 'The file name may hold letters, digits, dash and underscore only.',
  badText: 'The text is too long.',
  badFrame: 'The window gave no image.',
} as const;

export {
  MCP_MODULE_ID, MCP_HELPER_TOOL_NAMES, MCP_LOG_UNKNOWN_NAME, MCP_CALL_NAME_MAX_CHARS, MCP_ASK_TIMED_OUT, MCP_ASK_WINDOW_GONE, MCP_MESSAGE,
};
