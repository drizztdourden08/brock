/* @layer renderer-shell @kind types */
type ScreenParams = Record<string, unknown>;

interface NavigationState {
  active: string | null;
  params: ScreenParams;
  open: (id: string, params?: ScreenParams) => void;
  close: () => void;
}

interface UseNavigationResult {
  active: string | null;
  params: ScreenParams;
  open: (id: string, params?: ScreenParams) => void;
  close: () => void;
}

export type { NavigationState, ScreenParams, UseNavigationResult };
