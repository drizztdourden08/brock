/* @layer core @kind constants */
const CONTROLLER_SLOT_IDS = [
  'face.north', 'face.east', 'face.south', 'face.west',
  'dpad.up', 'dpad.down', 'dpad.left', 'dpad.right',
  'shoulder.left', 'shoulder.right', 'trigger.left', 'trigger.right',
  'stick.left', 'stick.right', 'stick.left.click', 'stick.right.click',
  'meta.view', 'meta.menu', 'meta.guide', 'meta.capture',
] as const;

export { CONTROLLER_SLOT_IDS };
