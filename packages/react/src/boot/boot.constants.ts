/* @layer renderer-shell @kind constants */
const HEARTBEAT_MS = 1000;
const FONT_TOKENS = ['--font-sans', '--font-title'] as const;
const FIRST_FRAME_TASK = 'first-frame';
const NO_BOOT_TASKS: never[] = [];

export { FIRST_FRAME_TASK, FONT_TOKENS, HEARTBEAT_MS, NO_BOOT_TASKS };
