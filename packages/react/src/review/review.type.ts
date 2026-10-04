/* @layer renderer-shell @kind types */
import type { ProductConfig, ReviewCheck, TitleBarControls } from '@drizztdourden08/brock-core';
import type { WindowTitleBarAction } from '@drizztdourden08/tessera/composites';
import type { MenuEntry } from '../menu/menu.type';
import type { ResolvedScreenTree } from '../screens/conventions/screen-tree.type';
import type { SearchTarget } from '../search/search.type';
import type { ScreenDef } from '../screens/screen.type';
import type { AppReview } from './app-review.type';

type ReviewOutcome = Omit<ReviewCheck, 'step'>;

interface ReviewEnv {
  product: ProductConfig;
  home: string;
  homeScreen: string;
  screens: readonly ScreenDef[];
  menu: readonly MenuEntry[];
  actions: readonly WindowTitleBarAction[];
  moduleIds: readonly string[];
  developerTools: boolean;
  screenTree: ResolvedScreenTree | null;
  review: AppReview | null;
}

interface StepTour {
  env: ReviewEnv;
  check: (id: string, pass: boolean, passReason: string, failReason: string) => void;
  report: (outcomes: readonly ReviewOutcome[]) => void;
  capture: (name: string) => Promise<void>;
}

interface ReviewStep {
  name: string;
  run: (tour: StepTour) => Promise<void>;
}

interface KeyChord {
  key: string;
  ctrlKey?: boolean;
}

interface BootSnapshot {
  titleBarVisible: boolean;
  title: string | null;
  expectedTitle: string;
  logoLoaded: boolean | null;
  searchButton: boolean;
  bugReportButton: boolean;
  barItems: readonly string[];
  expectedBarItems: readonly string[];
}

interface MenuItemSnapshot {
  label: string;
  hasIcon: boolean;
  isSection: boolean;
}

interface MenuSnapshot {
  open: boolean;
  items: readonly MenuItemSnapshot[];
}

interface MenuExpectation {
  required: readonly string[];
  sections: readonly string[];
  actions: readonly string[];
  view: string | null;
}

interface TitleBarExpectation {
  actions?: readonly WindowTitleBarAction[];
  controls?: Pick<TitleBarControls, 'pin' | 'fullscreen'>;
}

interface ViewMenuSnapshot {
  open: boolean;
  labels: readonly string[];
}

interface IconSlotSnapshot {
  label: string;
  text: string;
  hasElement: boolean;
}

interface FrameSnapshot {
  layers: number;
  card: boolean;
  title: string | null;
  closeButton: boolean;
}

interface ScreenFocusSnapshot {
  focusInside: boolean;
  pageInert: boolean;
  titleBarReachable: boolean | null;
  dockReachable: boolean | null;
}

interface PageHeaderSnapshot {
  shown: boolean;
  icon: boolean;
  title: string | null;
}

interface AboutSnapshot {
  logoLoaded: boolean | null;
  version: string | null;
  appVersion: string;
}

interface BucketSnapshot {
  hub: string;
  reachedVia: string | null;
  expected: readonly string[];
  shown: readonly string[];
}

interface HeroSnapshot {
  hub: string;
  rendered: boolean;
  title: string;
  slots: readonly string[];
}

interface UpdaterTitleBarSnapshot {
  versionShown: boolean;
  statusShown: boolean;
}

interface SearchSample {
  source: string;
  label: string;
  target?: SearchTarget;
  widget?: string;
}

interface SearchPick {
  shown: string[];
  picked: boolean;
}

interface PerformanceReading {
  tiles: Readonly<Record<string, string>>;
  sparklines: readonly string[];
  gauges: readonly string[];
  segments: number;
  legend: readonly string[];
  ownScroll: boolean;
}

interface PerformanceSnapshot {
  before: PerformanceReading;
  after: PerformanceReading;
  sampling: boolean;
  inBody: boolean;
}

interface SettingRowsSnapshot {
  total: number;
  empty: string[];
}

export type {
  AboutSnapshot, BootSnapshot, BucketSnapshot, FrameSnapshot, HeroSnapshot, IconSlotSnapshot, KeyChord, MenuExpectation, MenuItemSnapshot, MenuSnapshot, PageHeaderSnapshot, PerformanceReading, ScreenFocusSnapshot, PerformanceSnapshot, ReviewEnv,
  ReviewOutcome, ReviewStep, SearchPick, SearchSample, SettingRowsSnapshot, StepTour, TitleBarExpectation, UpdaterTitleBarSnapshot, ViewMenuSnapshot,
};
