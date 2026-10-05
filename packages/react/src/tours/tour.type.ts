/* @layer renderer-shell @kind types */
import type { ReactNode } from 'react';
import type { TourStepMascot, TourTarget } from '@drizztdourden08/tessera/composites';
import type { AnchoredPlacement } from '@drizztdourden08/tessera/primitives';
import type { AppContext } from '../contexts/contexts.type';
import type { ScreenParams } from '../navigation/navigation.type';

type TourShellPart = 'menu' | 'search' | 'report-bug' | 'title-bar' | 'screen';

type BrockTourTarget = TourTarget | { readonly shell: TourShellPart } | { readonly widget: string } | { readonly setting: string };

type NamedTourTarget = Exclude<BrockTourTarget, { readonly current: unknown }>;

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
  readonly signal: AbortSignal;
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
  readonly mascot?: TourStepMascot;
  readonly open?: string;
  readonly widget?: string;
  readonly context?: string | TourContextChange;
  readonly before?: (ctx: TourStepContext) => void | Promise<void>;
  readonly advanceOn?: TourAdvanceOn;
  readonly hint?: ReactNode;
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

type TouringKey = Pick<KeyboardEvent, 'key' | 'altKey' | 'ctrlKey' | 'metaKey' | 'shiftKey'>;

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

interface TourShown {
  id: string;
  index: number;
  step: string;
  target: HTMLElement | null;
}

interface TourSpotSlice {
  widget: string;
  selector: string;
}

interface TourClickSlice extends TourSpotSlice {
  step: string;
}

interface TourState {
  tours: readonly TourDef[];
  active: ActiveTour | null;
  progress: TourProgress;
  progressFor: string | null;
  shown: TourShown | null;
  spot: TourSpotSlice | null;
  clickRelay: TourClickSlice | null;
  setTours: (tours: readonly TourDef[]) => void;
  setActive: (active: ActiveTour | null) => void;
  setProgress: (progress: TourProgress, profileId?: string | null) => void;
  setShown: (shown: TourShown | null) => void;
  setSpot: (spot: TourSpotSlice | null) => void;
  setClickRelay: (clickRelay: TourClickSlice | null) => void;
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
  ActiveTour, BrockTourTarget, NamedTourTarget, TourAdvanceOn, TourApi, TourChoice, TourClickSlice, TourContextChange, TourDef, TourEntry, TourEventListener, TourProgress, TourShellPart,
  TourShown, TourSpotSlice, TourState, TourStepContext, TourStepDef, TourTrigger, TouringKey,
};
