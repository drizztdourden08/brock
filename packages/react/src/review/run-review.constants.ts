/* @layer renderer-shell @kind constants */
import { aboutStep } from './steps/about-step';
import { bootStep } from './steps/boot-step';
import { bucketsStep } from './steps/buckets-step';
import { bugReportStep } from './steps/bug-report-step';
import { escapeHomeStep } from './steps/escape-home-step';
import { fontsStep } from './steps/fonts-step';
import { heroStep } from './steps/hero-step';
import { stylesStep } from './steps/styles-step';
import { menuStep } from './steps/menu-step';
import { paletteStep } from './steps/palette-step';
import { profileStep } from './steps/profile-step';
import { screensStep } from './steps/screens-step';
import { searchStep } from './steps/search-step';
import { updaterStep } from './steps/updater-step';
import { widgetWindowsStep } from './steps/widget-windows-step';
import { widgetsStep } from './steps/widgets-step';
import type { ReviewStep } from './review.type';

const REVIEW_STEPS: readonly ReviewStep[] = [
  bootStep, profileStep, menuStep, screensStep, bucketsStep, heroStep, escapeHomeStep, paletteStep, searchStep, bugReportStep, updaterStep, aboutStep, widgetsStep, widgetWindowsStep,
  fontsStep, stylesStep,
];

export { REVIEW_STEPS };
