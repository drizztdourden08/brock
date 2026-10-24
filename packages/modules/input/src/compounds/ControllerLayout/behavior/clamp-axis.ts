/* @layer renderer-shell @kind logic */
import { finite } from './finite';

const clampAxis = (value: number | undefined): number => Math.min(1, Math.max(-1, finite(value)));

export { clampAxis };
