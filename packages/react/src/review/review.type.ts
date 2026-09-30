/* @layer renderer-shell @kind types */
import type { ProductConfig, ReviewCheck } from '@drizztdourden08/brock-core';
import type { MenuEntry } from '../menu/menu.type';
import type { ResolvedScreenTree } from '../screens/conventions/screen-tree.type';
import type { ScreenDef } from '../screens/screen.type';

type ReviewOutcome = Omit<ReviewCheck, 'step'>;

interface ReviewEnv {
  product: ProductConfig;
  home: string;
  homeScreen: string;
  screens: readonly ScreenDef[];
  menu: readonly MenuEntry[];
  slotCount: number;
  moduleIds: readonly string[];
  developerTools: boolean;
  screenTree: ResolvedScreenTree | null;
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
  slotsRendered: readonly boolean[];
  expectedSlots: number;
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

interface UpdaterTitleBarSnapshot {
  versionShown: boolean;
  badgeShown: boolean;
}

interface SettingRowsSnapshot {
  total: number;
  empty: string[];
}

export type {
  AboutSnapshot, BootSnapshot, BucketSnapshot, FrameSnapshot, IconSlotSnapshot, KeyChord, MenuExpectation, MenuItemSnapshot, MenuSnapshot, ReviewEnv,
  ReviewOutcome, ReviewStep, SettingRowsSnapshot, StepTour, UpdaterTitleBarSnapshot,
};
