/* @layer renderer-components @kind types */
import type { Bounds, OverlayFrame, OverlayLayout, OverlayMetrics, PlacedLabel, PlacedPart, Point, TextAnchor } from '../PadOverlay.type';

interface Rect {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

interface Circle {
  x: number;
  y: number;
  r: number;
}

type Segment = readonly [Point, Point];

type Axis = 'x' | 'y';

type Zone = 'left' | 'right' | 'above' | 'below';

type Toward = -1 | 1;

interface Span {
  low: number;
  high: number;
}

interface LabelSpot {
  elbow: Point;
  tail: Point;
  anchor: TextAnchor;
  nameAt: Point;
  detailAt: Point;
  rect: Rect;
  zone: Zone;
}

interface LabelOption {
  spot: LabelSpot;
  leader: readonly Point[];
  segments: readonly Segment[];
  cost: number;
}

interface LabelSize {
  w: number;
  up: number;
  down: number;
}

interface Scene {
  frame: OverlayFrame;
  parts: readonly PlacedPart[];
  circles: readonly Circle[];
  outline: readonly Point[];
  outlineEdges: readonly Segment[];
  hull: readonly Point[];
  hullEdges: readonly Segment[];
  spans: Map<string, Span | null>;
}

type Body = Pick<Scene, 'outline' | 'outlineEdges'>;

interface Regroup {
  domains: readonly (readonly LabelOption[])[];
  rest: readonly number[];
  budget: Budget;
  best: { cost: number; picks: LabelOption[] };
}

interface GrowRows {
  top: number;
  bottom: number;
}

interface Fitted {
  layout: OverlayLayout;
  scale: number;
  grow: GrowRows;
}

interface FitInput {
  polish?: boolean;
  raw: readonly PlacedPart[];
  bounds: Bounds;
  points: readonly Point[];
  metrics: OverlayMetrics;
  sizes: ReadonlyMap<string, LabelSize>;
  rowH: number;
}

interface Occupied {
  rects: Rect[];
  segments: Segment[];
}

type Choice = LabelOption | null;

type Domains = readonly (readonly LabelOption[] | null)[];

interface Budget {
  left: number;
}

interface Placement {
  labels: PlacedLabel[];
  clear: boolean;
}

export type {
  Axis, Body, Budget, Choice, Circle, Domains, FitInput, Fitted, GrowRows, LabelOption, LabelSize, LabelSpot, Occupied, Placement, Rect, Regroup, Scene,
  Segment, Span, Toward, Zone,
};
