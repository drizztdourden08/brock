/* @layer renderer-shell @kind constants */
import { aboutStep } from './steps/about-step';
import { bootStep } from './steps/boot-step';
import { bugReportStep } from './steps/bug-report-step';
import { escapeHomeStep } from './steps/escape-home-step';
import { menuStep } from './steps/menu-step';
import { paletteStep } from './steps/palette-step';
import { profileStep } from './steps/profile-step';
import { screensStep } from './steps/screens-step';
import { widgetsStep } from './steps/widgets-step';
import type { ReviewStep } from './review.type';

const REVIEW_STEPS: readonly ReviewStep[] = [
  bootStep, profileStep, menuStep, screensStep, escapeHomeStep, paletteStep, bugReportStep, aboutStep, widgetsStep,
];

export { REVIEW_STEPS };
