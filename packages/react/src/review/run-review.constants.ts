/* @layer renderer-shell @kind constants */
import { aboutStep } from './steps/about-step';
import { appWidgetsStep } from './steps/app-widgets-step';
import { bootStep } from './steps/boot-step';
import { bucketsStep } from './steps/buckets-step';
import { bugReportStep } from './steps/bug-report-step';
import { escapeHomeStep } from './steps/escape-home-step';
import { fontsStep } from './steps/fonts-step';
import { heroStep } from './steps/hero-step';
import { stylesStep } from './steps/styles-step';
import { menuStep } from './steps/menu-step';
import { paletteStep } from './steps/palette-step';
import { performanceStep } from './steps/performance-step';
import { profileStep } from './steps/profile-step';
import { screensStep } from './steps/screens-step';
import { searchStep } from './steps/search-step';
import { toursStep } from './steps/tours-step';
import { updaterStep } from './steps/updater-step';
import { widgetWindowsStep } from './steps/widget-windows-step';
import { widgetsStep } from './steps/widgets-step';
import type { ReviewStep } from './review.type';

const STEPS_BEFORE_SEED: readonly ReviewStep[] = [bootStep, profileStep];

const STEPS_AFTER_SEED: readonly ReviewStep[] = [
  menuStep, screensStep, bucketsStep, heroStep, escapeHomeStep, paletteStep, searchStep, bugReportStep, updaterStep, aboutStep, widgetsStep, performanceStep, appWidgetsStep, widgetWindowsStep,
  toursStep, fontsStep, stylesStep,
];

const BUILT_IN_STEP_NAMES: ReadonlySet<string> = new Set([...STEPS_BEFORE_SEED, ...STEPS_AFTER_SEED].map((step) => step.name));

export { BUILT_IN_STEP_NAMES, STEPS_AFTER_SEED, STEPS_BEFORE_SEED };
