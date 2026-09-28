/* @layer electron-main @kind constants */
const DEFAULT_EXTERNAL_PROTOCOLS = ['http:', 'https:', 'mailto:'];

const DEFAULT_PERMISSIONS = [
  'hid',
  'usb',
  'serial',
  'gamepad',
  'fullscreen',
  'pointerLock',
  'keyboardLock',
  'clipboard-read',
  'clipboard-sanitized-write',
  'media',
  'notifications',
  'window-management',
];

export { DEFAULT_EXTERNAL_PROTOCOLS, DEFAULT_PERMISSIONS };
