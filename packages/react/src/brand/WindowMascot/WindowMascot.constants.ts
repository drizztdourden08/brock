/* @layer renderer-shell @kind constants */
import type { MascotClip } from '@drizztdourden08/tessera/brand';

const WALKER_ID = 'walker';
const WALKER_HEIGHT = 112;
const WALKER_HALF = 36;
const WALKER_GAP = 24;
const MOVE_SLACK = 4;
const HINT_CLIP: MascotClip = 'point';
const REST_CLIP: MascotClip = 'idle';
const PALETTE_SELECTOR = '.command-palette--open';
const DEFAULT_SEARCH_HINT = 'Type to search pages, settings and actions.';

export { DEFAULT_SEARCH_HINT, HINT_CLIP, MOVE_SLACK, PALETTE_SELECTOR, REST_CLIP, WALKER_GAP, WALKER_HALF, WALKER_HEIGHT, WALKER_ID };
