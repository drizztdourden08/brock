/* @layer core @kind constants */
import type { McpBuiltInSpec } from './mcp.type';
import { MCP_TYPE_TEXT_MAX_CHARS } from './mcp.constants';

const POINT_MAX = 20_000;
const POINT_ARGS = {
  x: { type: 'number', label: 'X in CSS pixels', min: 0, max: POINT_MAX },
  y: { type: 'number', label: 'Y in CSS pixels', min: 0, max: POINT_MAX },
} as const;

const BUILT_IN_TOOLS: readonly McpBuiltInSpec[] = [
  {
    name: 'app_info', title: 'App info', side: 'main', readOnly: true, destructive: false, args: {},
    description: 'Returns the app id, name, version, whether it is a dev build, and the main window size, visibility and scale.',
  },
  {
    name: 'screenshot', title: 'Screenshot', side: 'main', readOnly: true, destructive: false,
    description: 'Captures the main window as a PNG. Image pixels are CSS pixels times the scale. A name also saves the file under Data/screenshots/mcp.',
    args: {
      name: { type: 'string', label: 'File name to save, letters, digits, dash and underscore', optional: true },
      maxWidth: { type: 'number', label: 'Widest image in pixels, default 1280', min: 64, max: 3840, optional: true },
      settle: { type: 'boolean', label: 'Wait for the window to settle first, default true', optional: true },
    },
  },
  {
    name: 'click', title: 'Click', side: 'main', readOnly: false, destructive: true,
    description: 'Clicks at a point of the main window, in CSS pixels. Button defaults to left, count to 1.',
    args: {
      ...POINT_ARGS,
      button: { type: 'string', label: 'Mouse button', optional: true, options: [{ value: 'left', label: 'Left' }, { value: 'right', label: 'Right' }, { value: 'middle', label: 'Middle' }] },
      count: { type: 'number', label: 'Click count', min: 1, max: 2, optional: true },
    },
  },
  {
    name: 'type_text', title: 'Type text', side: 'main', readOnly: false, destructive: true,
    description: `Types text into the focused element of the main window. At most ${MCP_TYPE_TEXT_MAX_CHARS} characters.`,
    args: { text: { type: 'string', label: 'Text to type' } },
  },
  {
    name: 'press_key', title: 'Press key', side: 'main', readOnly: false, destructive: true,
    description: 'Presses a key or a chord in the main window, such as Enter, Escape or Ctrl+Shift+S.',
    args: { chord: { type: 'string', label: 'Key or chord joined by plus signs' } },
  },
  {
    name: 'scroll', title: 'Scroll', side: 'main', readOnly: false, destructive: false,
    description: 'Scrolls the wheel at a point of the main window. Positive dy scrolls down, positive dx scrolls right.',
    args: {
      ...POINT_ARGS,
      dx: { type: 'number', label: 'Horizontal delta in pixels', min: -10_000, max: 10_000, optional: true },
      dy: { type: 'number', label: 'Vertical delta in pixels', min: -10_000, max: 10_000, optional: true },
    },
  },
  {
    name: 'list_widgets', title: 'List widgets', side: 'renderer', readOnly: true, destructive: false, args: {},
    description: 'Lists the widgets with id, label, visible, available and popped.',
  },
  {
    name: 'open_widget', title: 'Open widget', side: 'renderer', readOnly: false, destructive: false,
    description: 'Opens, closes or focuses a widget. Action defaults to open. Returns whether it is visible.',
    args: {
      id: { type: 'string', label: 'Widget id' },
      action: { type: 'string', label: 'Action', optional: true, options: [{ value: 'open', label: 'Open' }, { value: 'close', label: 'Close' }, { value: 'focus', label: 'Focus' }] },
    },
  },
  {
    name: 'list_commands', title: 'List commands', side: 'renderer', readOnly: true, destructive: false,
    description: 'Lists the commands with id, label, group, enabled, reason and args, including open:<route> commands.',
    args: { query: { type: 'string', label: 'Text to filter by', optional: true } },
  },
  {
    name: 'run_command', title: 'Run command', side: 'renderer', readOnly: false, destructive: true,
    description: 'Runs a command as the assistant. The args field is a JSON object as text, checked against the command schema.',
    args: {
      id: { type: 'string', label: 'Command id' },
      args: { type: 'string', label: 'Command arguments as a JSON object', optional: true },
    },
  },
  {
    name: 'read_ui', title: 'Read UI', side: 'renderer', readOnly: true, destructive: false,
    description: 'Reads the visible buttons, fields, links and headings with role, name and box. Never returns a password value.',
    args: {
      query: { type: 'string', label: 'Text to filter by', optional: true },
      max: { type: 'number', label: 'Most nodes, default 300', min: 1, max: 1000, optional: true },
    },
  },
];

export { BUILT_IN_TOOLS };
