/* @layer core @kind constants */
const BASE_AUTOMATION_FLAGS = [
  '--instance',
  '--profile',
  '--fresh',
  '--window-size',
  '--no-focus',
  '--screenshot',
  '--screenshot-splash',
  '--review',
] as const;

const IDENTITY_FLAGS = ['--instance', '--profile'];

export { BASE_AUTOMATION_FLAGS, IDENTITY_FLAGS };
