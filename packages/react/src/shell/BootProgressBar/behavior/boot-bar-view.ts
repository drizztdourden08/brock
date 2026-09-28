/* @layer renderer-shell @kind logic */
import type { BootPhase } from '../../../stores/boot-progress.type';
import type { BootBarView } from '../BootProgressBar.type';

const fillWidthOf = (phase: BootPhase, ratio: number | null): string | undefined => {
  if (phase === 'ready') return '100%';
  if (ratio == null) return undefined;
  return `${Math.round(ratio * 100)}%`;
};

const bootBarView = (phase: BootPhase, ratio: number | null, fading: boolean): BootBarView => {
  const indeterminate = ratio == null && phase !== 'ready';
  const className = [
    'boot-bar',
    fading && 'boot-bar--done',
    indeterminate && 'boot-bar--indeterminate',
    phase === 'error' && 'boot-bar--error',
  ].filter(Boolean).join(' ');
  return { className, fillWidth: fillWidthOf(phase, ratio) };
};

export { bootBarView };
