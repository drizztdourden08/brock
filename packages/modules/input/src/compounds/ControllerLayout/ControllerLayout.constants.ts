/* @layer renderer-shell @kind constants */
const CONTROLLER_SLOT_IDS = [
  'face.north', 'face.east', 'face.south', 'face.west',
  'dpad.up', 'dpad.down', 'dpad.left', 'dpad.right',
  'shoulder.left', 'shoulder.right', 'trigger.left', 'trigger.right',
  'stick.left', 'stick.right', 'stick.left.click', 'stick.right.click',
  'meta.view', 'meta.menu', 'meta.guide', 'meta.capture',
] as const;

const CONTROLLER_LAYOUT_VARIANTS = ['offset', 'symmetric', 'nintendo', 'pad'] as const;

const CONTROLLER_STRINGS = {
  controller: 'Controller',
  held: 'Held now',
  nothingHeld: 'Nothing held',
  otherInputs: 'Other inputs',
  amount: (name: string, percent: number) => `${name} ${percent}%`,
  stickAt: (name: string, x: string, y: string) => `${name} at ${x}, ${y}`,
  names: {
    'face.north': 'Top face button',
    'face.east': 'Right face button',
    'face.south': 'Bottom face button',
    'face.west': 'Left face button',
    'dpad.up': 'D-pad up',
    'dpad.down': 'D-pad down',
    'dpad.left': 'D-pad left',
    'dpad.right': 'D-pad right',
    'shoulder.left': 'Left shoulder',
    'shoulder.right': 'Right shoulder',
    'trigger.left': 'Left trigger',
    'trigger.right': 'Right trigger',
    'stick.left': 'Left stick',
    'stick.right': 'Right stick',
    'stick.left.click': 'Left stick click',
    'stick.right.click': 'Right stick click',
    'meta.view': 'View',
    'meta.menu': 'Menu',
    'meta.guide': 'Guide',
    'meta.capture': 'Capture',
  },
};

const VIEW_W = 400;
const VIEW_H = 260;
const VIEW_BOX = `0 0 ${VIEW_W} ${VIEW_H}`;

const NO_EXTRAS: readonly never[] = [];

const ANALOG_IDS: ReadonlySet<string> = new Set(['trigger.left', 'trigger.right', 'shoulder.left', 'shoulder.right']);

const STICK_IDS: ReadonlySet<string> = new Set(['stick.left', 'stick.right']);

const STICK_REST = 0.08;
const STICK_CAP_RATIO = 0.4;
const STICK_TRAVEL_RATIO = 0.52;
const TRIGGER_INSET = 2;

export {
  ANALOG_IDS, CONTROLLER_LAYOUT_VARIANTS, CONTROLLER_SLOT_IDS, CONTROLLER_STRINGS, NO_EXTRAS, STICK_CAP_RATIO, STICK_IDS, STICK_REST, STICK_TRAVEL_RATIO,
  TRIGGER_INSET, VIEW_BOX, VIEW_H, VIEW_W,
};
