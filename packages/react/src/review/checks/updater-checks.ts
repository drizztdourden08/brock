/* @layer renderer-shell @kind logic */
import type { ReviewOutcome, UpdaterTitleBarSnapshot } from '../review.type';
import { outcome } from './outcome';

const updaterChecks = (snapshot: UpdaterTitleBarSnapshot): ReviewOutcome[] => {
  const { versionShown, badgeShown } = snapshot;
  return [
    outcome('no-version-tag', !versionShown, 'the title bar shows no version tag', 'the title bar shows the app version'),
    outcome(
      'no-update-badge',
      !badgeShown,
      'no update badge while no update is known',
      'the title bar shows the update badge although no check has run',
    ),
  ];
};

export { updaterChecks };
