/* @layer renderer-shell @kind constants */
import { NARROW_WINDOW } from '../review.constants';

const SEED_STEP = 'seed';
const NARROW_SIZE = { name: 'narrow', ...NARROW_WINDOW } as const;

export { NARROW_SIZE, SEED_STEP };
