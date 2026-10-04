/* @layer renderer-shell @kind constants */
const HEARTBEAT_MS = 1000;
const FONT_TOKENS = ['--font-sans', '--font-title'] as const;
const FIRST_FRAME_TASK = 'first-frame';
const SETTINGS_TASK = 'settings';
const BUILT_IN_BOOT_TASKS: readonly string[] = ['profiles', SETTINGS_TASK, 'fonts', 'images', FIRST_FRAME_TASK];
const NO_BOOT_TASKS: never[] = [];

export { BUILT_IN_BOOT_TASKS, FIRST_FRAME_TASK, FONT_TOKENS, HEARTBEAT_MS, NO_BOOT_TASKS, SETTINGS_TASK };
