/* @layer core @kind types */
type FirstRunMark = 'pending' | 'done';

interface AppState {
  lastProfileId: string | null;
  firstRun?: FirstRunMark;
  tours?: unknown;
  locale?: string | null;
}

type AppStateChange = (state: AppState) => AppState;

export type { AppState, AppStateChange, FirstRunMark };
