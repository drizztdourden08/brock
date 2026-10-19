/* @layer renderer-shell @kind constants */
import type { MascotClip } from '@drizztdourden08/tessera/brand';

const WALKER_ID = 'walker';
const WALKER_HEIGHT = 112;
const WALKER_HALF = 36;
const WALKER_EDGE_FRACTION = 0.08;
const WALKER_GAP = 24;
const MOVE_SLACK = 4;
const HINT_CLIP: MascotClip = 'point';
const PALETTE_SELECTOR = '.command-palette--open';
const DEFAULT_SEARCH_HINT = 'Type to search pages, settings and actions.';

export { DEFAULT_SEARCH_HINT, HINT_CLIP, MOVE_SLACK, PALETTE_SELECTOR, WALKER_EDGE_FRACTION, WALKER_GAP, WALKER_HALF, WALKER_HEIGHT, WALKER_ID };
