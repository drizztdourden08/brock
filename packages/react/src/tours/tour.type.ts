/* @layer renderer-shell @kind types */
import type { ReactNode } from 'react';
import type { MascotClip } from '@drizztdourden08/tessera/brand';
import type { TourTarget } from '@drizztdourden08/tessera/composites';
import type { AnchoredPlacement } from '@drizztdourden08/tessera/primitives';
import type { AppContext } from '../contexts/contexts.type';
import type { ScreenParams } from '../navigation/navigation.type';

type TourShellPart = 'menu' | 'search' | 'report-bug' | 'title-bar' | 'screen';

type BrockTourTarget = TourTarget | { readonly shell: TourShellPart } | { readonly widget: string };

type TourAdvanceOn =
  | { readonly click: string | BrockTourTarget }
  | { readonly event: string }
  | { readonly context: string; readonly active?: boolean };

interface TourContextChange {
  readonly name: string;
  readonly active?: boolean;
  readonly data?: unknown;
}

interface TourStepContext {
  readonly tourId: string;
  readonly stepId: string;
  readonly index: number;
  readonly profileId: string | null;
  open: (route: string, params?: ScreenParams) => void;
  close: () => void;
  openWidget: (id: string) => void;
  setContext: (name: string, value: AppContext) => void;
}

interface TourStepDef {
  readonly id: string;
  readonly title: string;
  readonly body: ReactNode;
  readonly target?: BrockTourTarget;
  readonly placement?: AnchoredPlacement;
  readonly mascot?: MascotClip;
  readonly open?: string;
  readonly widget?: string;
  readonly context?: string | TourContextChange;
  readonly before?: (ctx: TourStepContext) => void | Promise<void>;
  readonly advanceOn?: TourAdvanceOn;
}

type TourTrigger = 'first-run' | 'manual';

interface TourDef {
  readonly id: string;
  readonly title: string;
  readonly description?: string;
  readonly steps: readonly TourStepDef[];
  readonly trigger?: TourTrigger;
}

type TourChoice = Pick<TourDef, 'id' | 'title'>;

type TourEventListener = (name: string) => void;

type TouringKey = 'close' | 'skip' | null;

interface TourEntry {
  id: string;
  tour: TourDef;
}

interface TourProgress {
  completed: readonly string[];
  started: readonly string[];
  last: Readonly<Record<string, number>>;
}

interface ActiveTour {
  id: string;
  index: number;
}

interface TourState {
  tours: readonly TourDef[];
  active: ActiveTour | null;
  progress: TourProgress;
  progressFor: string | null;
  setTours: (tours: readonly TourDef[]) => void;
  setActive: (active: ActiveTour | null) => void;
  setProgress: (progress: TourProgress, profileId?: string | null) => void;
}

interface TourApi {
  active: ActiveTour | null;
  tour: TourDef | null;
  step: TourStepDef | null;
  tours: readonly TourDef[];
  start: (id: string, at?: number) => boolean;
  stop: () => void;
  next: () => void;
  back: () => void;
  isCompleted: (id: string) => boolean;
}

export type {
  ActiveTour, BrockTourTarget, TourAdvanceOn, TourApi, TourChoice, TourContextChange, TourDef, TourEntry, TourEventListener, TouringKey, TourProgress,
  TourShellPart, TourState, TourStepContext, TourStepDef, TourTrigger,
};
