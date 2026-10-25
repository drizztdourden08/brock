/* @layer renderer-shell @kind types */
type Politeness = 'polite' | 'assertive';

interface AnnounceOptions {
  politeness?: Politeness;
}

interface AnnouncerState {
  polite: string;
  assertive: string;
  setText: (politeness: Politeness, text: string) => void;
}

export type { AnnounceOptions, AnnouncerState, Politeness };
