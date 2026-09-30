/* @layer renderer-shell @kind types */
import type { BootFailure, BootTask, BootTaskContext, BootTaskDef, Profile, ProductConfig } from '@drizztdourden08/brock-core';

interface RendererBootExtras {
  profile: Profile | null;
  product: ProductConfig;
}

type RendererBootContext = BootTaskContext<RendererBootExtras>;
type RendererBootTaskDef = BootTaskDef<RendererBootExtras>;
type RendererBootTask = BootTask<RendererBootExtras>;

type BootPhase = 'running' | 'painting' | 'ready' | 'failed';

interface BootState {
  phase: BootPhase;
  failure: BootFailure | null;
  setPhase: (phase: BootPhase) => void;
  fail: (failure: BootFailure) => void;
}

interface FramePainted {
  promise: Promise<void>;
  resolve: () => void;
}

export type { BootPhase, BootState, FramePainted, RendererBootContext, RendererBootExtras, RendererBootTask, RendererBootTaskDef };
