/* @layer renderer-shell @kind types */
import type { TourResetPart } from '../tours/tour.type';

type ResetFlags = Readonly<Record<TourResetPart, boolean>>;

export type { ResetFlags };
