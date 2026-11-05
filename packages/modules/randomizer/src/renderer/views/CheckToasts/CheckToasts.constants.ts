/* @layer renderer-shell @kind constants */
const TOAST_DURATION_MS = 5000;

const MAX_BURST = 6;

const MAX_VISIBLE = 5;

const LOAD_QUIET_MS = 5000;

const TOAST_GROUPING = 'region';

const NO_MARKS: ReadonlySet<string> = new Set();

const NOTICE_TONES = { item: 'primary', player: 'secondary' } as const;

const IGNORE_MARK = (): void => undefined;

export { IGNORE_MARK, LOAD_QUIET_MS, MAX_BURST, MAX_VISIBLE, NOTICE_TONES, NO_MARKS, TOAST_DURATION_MS, TOAST_GROUPING };
