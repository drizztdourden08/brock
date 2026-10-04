/* @layer renderer-shell @kind types */
interface ScreenRestore {
  navigation: boolean;
  homeScreen: string;
  known: (id: string) => boolean;
}

export type { ScreenRestore };
