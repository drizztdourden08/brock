/* @layer renderer-shell @kind types */
type AppendLines = (lines: string[]) => void;

type EventTargetLike = Pick<Window, 'addEventListener' | 'removeEventListener'>;

interface RendererLogging {
  sessionLog?: boolean;
  popped: boolean;
}

export type { AppendLines, EventTargetLike, RendererLogging };
