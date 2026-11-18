/* @layer renderer-shell @kind types */
import type { QuitDecision } from '@drizztdourden08/brock-core';
import type { Text } from '@drizztdourden08/brock-core/i18n';

type BeforeQuit = () => string | null | undefined;

type OnBeforeQuit = () => QuitDecision | Promise<QuitDecision>;

interface QuitGuardRegistry {
  add: (guard: BeforeQuit) => () => void;
  addAsync: (guard: OnBeforeQuit) => () => void;
  messages: () => string[];
  decide: () => Promise<QuitDecision>;
  count: () => number;
  subscribe: (listener: () => void) => () => void;
}

interface SaveBeforeQuitOptions {
  dirty: () => boolean;
  save: () => Promise<boolean | void>;
  title?: Text;
  message?: Text;
  saveLabel?: Text;
  discardLabel?: Text;
}

export type { BeforeQuit, OnBeforeQuit, QuitGuardRegistry, SaveBeforeQuitOptions };
