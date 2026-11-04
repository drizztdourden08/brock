/* @layer core @kind logic */
import type { MsuResumeState } from '../types';
import { msuSessionState } from './msu-session-state';

const msuSnapshot = (): MsuResumeState | null => msuSessionState.engine?.snapshot() ?? null;

export { msuSnapshot };
