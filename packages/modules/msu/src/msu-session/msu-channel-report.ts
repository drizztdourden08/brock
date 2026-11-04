/* @layer core @kind logic */
import type { MsuChannelReport } from '../types';
import { msuSessionState } from './msu-session-state';

const msuChannelReport = (name: string): MsuChannelReport | null =>
  msuSessionState.engine?.reportChannel(name) ?? null;

export { msuChannelReport };
