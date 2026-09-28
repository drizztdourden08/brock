/* @layer renderer-shell @kind logic */
import type { DebugLine, DebugSection } from './diagnostics.type';

const debugSection = (title: string, lines: readonly DebugLine[]): DebugSection => ({
  title,
  lines: lines.filter((line): line is string => typeof line === 'string' && line.length > 0),
});

export { debugSection };
