/* @layer core @kind types */
type FirstRunMark = 'pending' | 'done';

interface AppState {
  lastProfileId: string | null;
  firstRun?: FirstRunMark;
  tours?: unknown;
}

type AppStateChange = (state: AppState) => AppState;

export type { AppState, AppStateChange, FirstRunMark };
