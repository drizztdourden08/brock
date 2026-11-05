/* @layer core @kind types */
interface ReplayModel<State> {
  locationKey(name: string): string | undefined;
  itemKey(name: string): string | undefined;
  eventKey(name: string): string | undefined;
  place(pairs: readonly (readonly [string, string])[]): void;
  startState(): State;
  reachedLocation(state: State, key: string): boolean;
  reachedEvent(state: State, key: string): boolean;
  collect(state: State, key: string): void;
  sweep(): { beaten: boolean; unreachable: string[] };
}

interface ForwardVerdict {
  unknown: string[];
  sphereMisses: string[];
  unreachable: string[];
  beaten: boolean;
}

export type { ForwardVerdict, ReplayModel };
