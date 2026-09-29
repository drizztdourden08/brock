/* @layer renderer-shell @kind logic */
import type { AboutSnapshot, ReviewOutcome } from '../review.type';
import { outcome } from './outcome';

const aboutChecks = (snapshot: AboutSnapshot): ReviewOutcome[] => {
  const { logoLoaded, version, appVersion } = snapshot;
  return [
    outcome('about-logo', logoLoaded === true, 'the About logo loaded', logoLoaded === null ? 'About has no logo image' : 'the About logo did not load'),
    outcome('about-version', version === appVersion, `the version row shows ${appVersion}`, `the version row shows "${version ?? '(none)'}", expected ${appVersion}`),
  ];
};

export { aboutChecks };
