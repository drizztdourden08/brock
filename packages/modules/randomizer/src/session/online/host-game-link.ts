/* @layer core @kind logic */
import type { GameLinkHost } from './host-game-link.type';
import type { OnlineParts } from './online-parts.type';

const noUnsubscribe = (): void => undefined;

const hostGameLink = <P, A>({ ap, run }: OnlineParts<P, A>): GameLinkHost => ({
  isFileInPlay: () => ap.file?.inPlay() ?? true,
  onSaveSwap: (f) => ap.file?.onSwap(f) ?? noUnsubscribe,
  goalReached: () => run.goalDone,
  setDeathLink(on) {
    ap.deathLink?.setEnabled?.(on);
  },
  killLink: () => ap.deathLink?.kill() ?? 'unsupported',
  onLinkDied: (f) => ap.deathLink?.onDied(f) ?? noUnsubscribe,
});

export { hostGameLink };
