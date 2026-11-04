/* @layer mcp-helper @kind constants */
import { MCP_PROTOCOL_VERSION } from '../mcp.constants';
import type { McpToolDescriptor } from '../mcp.type';

const HELPER_INFO = { name: 'brock-mcp', title: 'Brock app control', version: `protocol-${MCP_PROTOCOL_VERSION}` } as const;

const HELPER_ARG = { userData: '--user-data=', instance: '--instance=', file: '--bridge-file=' } as const;

const HELPER_REQUEST_BUDGET_BYTES = 256 * 1024;

const SELECT_APP_SPEC: McpToolDescriptor = {
  name: 'select_app',
  title: 'Select app',
  description: 'Points this helper at another running app: a user data folder, an instance name or a bridge file. Give at least one.',
  readOnly: false,
  destructive: false,
  args: {
    userData: { type: 'string', label: 'User data folder of the app launch, relative to the app folder', optional: true },
    instance: { type: 'string', label: 'Instance name of the app launch', optional: true },
    file: { type: 'string', label: 'Bridge discovery file, used as given', optional: true },
  },
};

const HELPER_TEXT = {
  instructions:
    'Controls a running Brock app: screenshots, input, widgets, commands and app tools. When the app is down, tools fail with a hint on how to start it. Call select_app to point at another app launch.',
  noApp: 'The helper does not know which app to reach. Pass --bridge-file=<file> or set BROCK_BRIDGE_FILE.',
  appDown: (file: string) => `The app is not running or its bridge is not reachable (looked at ${file}).`,
  startHint: 'Start the app with its own launch verb, for example "<app> launch main none", or plainly with "pnpm start:headless -- --user-data=<folder>". Use the same folder as --user-data of this helper, then call the tool again.',
  tooLarge: (bytes: number, max: number) => `The request is ${bytes} bytes; the most one call may carry is ${max}.`,
  protocol: (got: number, want: number) => `The app speaks MCP bridge protocol ${got} and this helper speaks ${want}. Rebuild the app and the helper from the same Brock version.`,
  selectNothing: 'Give userData, instance or file.',
  selected: (file: string, running: boolean) => `Target is now ${file}. The app is ${running ? 'running' : 'not running'}.`,
  fatal: (message: string) => `brock-mcp stopped: ${message}`,
} as const;

export { HELPER_INFO, HELPER_ARG, HELPER_REQUEST_BUDGET_BYTES, SELECT_APP_SPEC, HELPER_TEXT };
