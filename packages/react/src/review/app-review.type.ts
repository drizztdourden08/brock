/* @layer renderer-shell @kind types */
import type { IpcApi, Platform } from '@drizztdourden08/brock-core';
import type { KeyChord, StepTour } from './review.type';

interface ReviewKit {
  find: (selector: string, root?: ParentNode) => HTMLElement | null;
  findAll: (selector: string, root?: ParentNode) => HTMLElement[];
  click: (target: HTMLElement) => void;
  hover: (target: HTMLElement) => void;
  typeText: (input: HTMLInputElement | HTMLTextAreaElement, text: string) => void;
  press: (chord: KeyChord) => void;
  waitFor: <T>(probe: () => T | null | undefined | false, timeoutMs?: number) => Promise<T | null>;
  settle: () => Promise<void>;
  delay: (ms: number) => Promise<void>;
  openScreen: (id: string) => Promise<string>;
  openWidget: (id: string) => Promise<HTMLElement | null>;
  resetUi: () => Promise<void>;
}

interface AppReviewTour extends StepTour, ReviewKit {
  id: string;
  platform: Platform;
  api: IpcApi;
}

interface ReviewStepDef {
  run: (tour: AppReviewTour) => Promise<void>;
}

type ReviewSeedDef = ReviewStepDef;

interface AppReviewStepEntry {
  id: string;
  load: () => Promise<{ default: ReviewStepDef }>;
}

interface AppReviewFixture {
  path: string;
  load: () => Promise<{ default: string }>;
}

interface AppReview {
  seed: (() => Promise<{ default: ReviewSeedDef }>) | null;
  steps: readonly AppReviewStepEntry[];
  fixtures?: readonly AppReviewFixture[];
}

type FixtureTour = Pick<AppReviewTour, 'check'> & { platform: { files: Pick<Platform['files'], 'writeBytes'> } };

export type { AppReview, AppReviewFixture, AppReviewStepEntry, AppReviewTour, FixtureTour, ReviewKit, ReviewSeedDef, ReviewStepDef };
