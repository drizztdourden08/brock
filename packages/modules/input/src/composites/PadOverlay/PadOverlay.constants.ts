/* @layer renderer-components @kind constants */
import type { ControllerSlotId } from '../../pad/controller-slot.type';
import type { OverlayPartKind } from './PadOverlay.type';

const DIRECTION_NAMES = { up: 'Up', right: 'Right', down: 'Down', left: 'Left' } as const;

const FACE_DIRECTIONS: Readonly<Partial<Record<ControllerSlotId, string>>> = {
  'face.north': DIRECTION_NAMES.up,
  'face.east': DIRECTION_NAMES.right,
  'face.south': DIRECTION_NAMES.down,
  'face.west': DIRECTION_NAMES.left,
};

const MIN_UNDERLINE_SAMPLE = '0'.repeat(5);

const GLYPH_REACH: Readonly<Record<OverlayPartKind, number>> = { button: 1.15, analog: 1.15, stick: 1.1, dpad: 1.1 };

const DETAIL_SAMPLES: Readonly<Record<OverlayPartKind, string>> = {
  button: '', analog: '100%', stick: '-0.00, -0.00', dpad: 'Down + Right',
};

const FRAME_PAD = 8;
const LEADER_GAP = 2;
const HALO_PAD = 3;
const NAME_LINE_RATIO = 1.2;
const DETAIL_LINE_RATIO = 1.2;
const GLYPH_MARGIN = 4;
const LABEL_PAD = 3;
const LABEL_GAP = 14;
const TEXT_INSET = 2;
const UNDERLINE_GAP = 2;
const LEADER_SPACING = 3;
const BEND_COST = 14;
const BEND_MARGIN = 16;
const END_COST = 80;
const BELOW_RATE = 1.2;
const REFINE_EJECT = 2;
const REFINE_PASSES = 3;
const REGROUP_SIZE = 5;
const REGROUP_SEEDS = 2;
const REGROUP_PROBE = 8;
const REGROUP_BRANCH = 64;
const REGROUP_BUDGET = 8000;
const PRIORITY_BUDGET = 8000;
const POLISH_ROUNDS = 3;
const BODY_COST = 2;
const TOP_MISS_COSTS: Readonly<Partial<Record<ControllerSlotId, number>>> = { 'meta.view': 700, 'meta.menu': 500, 'meta.capture': 250 };
const TOP_PREFERRED_SLOTS: readonly ControllerSlotId[] = ['meta.view', 'meta.menu', 'meta.capture'];
const END_REACH = 4;
const TOP_END_REACH = 6;
const END_STEP_RATIO = 2;
const END_ROWS = 3;
const CENTRE_BAND = 0.1;
const HULL_SAMPLES = 12;
const TOWARDS = [-1, 1] as const;
const OPTION_LIMIT = 64;
const CURVE_STEPS = 8;
const SEARCH_STEPS = 8;
const SCALE_STEP = 0.1;
const SCALE_CANDIDATES = 4;
const SHRINK_COST = 1200;
const GROWN_COST = 3;
const SEARCH_BRANCH = 5;
const RESIZE_SETTLE_MS = 80;
const LAYOUT_CACHE_SIZE = 24;
const LAYOUT_DELAY_MS = 0;
const SEARCH_BUDGET = 150;
const MIN_SCALE_RATIO = 0.25;
const GROW_ROWS = 3;
const GROW_EXTRA_ROWS = 1;
const GROWN_SLACK = 1;

const STICK_CAP_RATIO = 0.6;
const STICK_WELL_GAP = 0.06;
const STICK_TICK_FROM = 0.55;
const STICK_TICK_TO = 0.88;
const STICK_MARKS: Readonly<Partial<Record<ControllerSlotId, string>>> = { 'stick.left': 'L', 'stick.right': 'R' };
const STICK_ACTIVE_DEFLECTION = 0.15;
const DEGREES_PER_RADIAN = 180 / Math.PI;
const DETAIL_DECIMALS = 2;
const FALLBACK_FONT_PX = 14;
const CHAR_WIDTH_RATIO = 0.6;

export {
  BELOW_RATE, BEND_COST, BEND_MARGIN, BODY_COST, CENTRE_BAND, CHAR_WIDTH_RATIO, CURVE_STEPS, DEGREES_PER_RADIAN, DETAIL_DECIMALS, DETAIL_LINE_RATIO, DETAIL_SAMPLES, DIRECTION_NAMES,
  END_COST, END_REACH, END_ROWS, END_STEP_RATIO, FACE_DIRECTIONS, FALLBACK_FONT_PX, FRAME_PAD, GLYPH_MARGIN, GLYPH_REACH, GROW_EXTRA_ROWS, GROW_ROWS, GROWN_SLACK,
  HALO_PAD, HULL_SAMPLES, LABEL_GAP, LABEL_PAD, LAYOUT_CACHE_SIZE, LAYOUT_DELAY_MS, LEADER_GAP, LEADER_SPACING, MIN_SCALE_RATIO, MIN_UNDERLINE_SAMPLE, NAME_LINE_RATIO,
  OPTION_LIMIT, POLISH_ROUNDS, PRIORITY_BUDGET, RESIZE_SETTLE_MS, REFINE_EJECT, REFINE_PASSES, REGROUP_BRANCH, REGROUP_BUDGET, REGROUP_PROBE, REGROUP_SEEDS, REGROUP_SIZE, SCALE_CANDIDATES, SCALE_STEP, SEARCH_BRANCH, SEARCH_BUDGET, SEARCH_STEPS, GROWN_COST, SHRINK_COST, STICK_ACTIVE_DEFLECTION, STICK_CAP_RATIO, STICK_MARKS,
  STICK_TICK_FROM, STICK_TICK_TO, STICK_WELL_GAP, TEXT_INSET, TOP_END_REACH, TOP_MISS_COSTS, TOP_PREFERRED_SLOTS, TOWARDS, UNDERLINE_GAP,
};
