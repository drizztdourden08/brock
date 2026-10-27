/* @layer electron-main @kind types */
import type { JsonValue } from '@drizztdourden08/brock-core/ipc';

type RestartWindow = 'same' | 'show' | 'background';

interface RestartOptions {
  handoff?: JsonValue;
  window?: RestartWindow;
}

interface HandoffEnvelope {
  writtenAt: number;
  value: JsonValue;
}

export type { HandoffEnvelope, RestartOptions, RestartWindow };
