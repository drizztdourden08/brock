/* @layer renderer-shell @kind logic */
import type { AboutSnapshot, AboutWordmarkFit, ReviewOutcome } from '../review.type';
import { outcome } from './outcome';

const px = (value: number): string => `${Math.round(value)} px`;

const wordmarkFitCheck = (fit: AboutWordmarkFit): ReviewOutcome => {
  const { left, right, cardLeft, cardRight } = fit;
  const over = [
    ...(left < cardLeft - 0.5 ? [`${px(cardLeft - left)} past its left edge`] : []),
    ...(right > cardRight + 0.5 ? [`${px(right - cardRight)} past its right edge`] : []),
  ];
  return outcome(
    'about-wordmark-fits',
    over.length === 0,
    `the wordmark (${px(left)} to ${px(right)}) fits inside the About card (${px(cardLeft)} to ${px(cardRight)})`,
    `the wordmark overflows the About card, ${over.join(' and ')}, so it is cut`,
  );
};

const aboutChecks = (snapshot: AboutSnapshot): ReviewOutcome[] => {
  const { logoLoaded, version, appVersion, wordmark = null } = snapshot;
  return [
    outcome('about-logo', logoLoaded === true, 'the About logo loaded', logoLoaded === null ? 'About has no logo image' : 'the About logo did not load'),
    outcome('about-version', version === appVersion, `the version row shows ${appVersion}`, `the version row shows "${version ?? '(none)'}", expected ${appVersion}`),
    ...(wordmark ? [wordmarkFitCheck(wordmark)] : []),
  ];
};

export { aboutChecks };
