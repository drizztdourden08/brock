/* @layer renderer-shell @kind logic */
import type { RefObject } from 'react';
import type { PreviewSession } from './preview-session.type';

const isCurrentSession = <Ctx = unknown>(sessionRef: RefObject<PreviewSession<Ctx> | null>, ctx: AudioContext): boolean =>
  sessionRef.current?.ctx === ctx;

export { isCurrentSession };
