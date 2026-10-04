/* @layer renderer-shell @kind types */
type BeforeQuit = () => string | null | undefined;

interface QuitGuardRegistry {
  add: (guard: BeforeQuit) => () => void;
  messages: () => string[];
}

export type { BeforeQuit, QuitGuardRegistry };
