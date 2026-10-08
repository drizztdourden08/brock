/* @layer renderer-shell @kind types */
import type { LogEntry, PlatformInfo, SystemDiagnostics } from '@drizztdourden08/brock-core';

interface DebugSection {
  title: string;
  lines: string[];
}

type DebugLine = string | null | false | undefined;

interface RuntimeLabels {
  runtime: string;
  engine: string;
  platform: string;
}

interface WindowEnvironment {
  screenWidth: number;
  screenHeight: number;
  availWidth: number;
  availHeight: number;
  viewportWidth: number;
  viewportHeight: number;
  devicePixelRatio: number;
  colorDepth: number;
  colorScheme: 'dark' | 'light';
  reducedMotion: boolean;
}

interface DebugTextInput {
  productName: string;
  version: string;
  labels: RuntimeLabels;
  info: PlatformInfo;
  system: SystemDiagnostics | null;
  window: WindowEnvironment | null;
  logs: readonly LogEntry[];
  userAgent: string;
}

interface DebugText {
  text: string | null;
  system: SystemDiagnostics | null;
  version: string;
  labels: RuntimeLabels;
}

export type { DebugLine, DebugSection, DebugText, DebugTextInput, RuntimeLabels, WindowEnvironment };
