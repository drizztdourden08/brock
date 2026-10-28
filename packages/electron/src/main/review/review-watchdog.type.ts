/* @layer electron-main @kind types */
interface ReviewWatchdogTrip {
  kind: 'silent-boot' | 'boot-cap' | 'idle';
  ms: number;
}

interface ReviewWatchdogOptions {
  startMs: number;
  idleMs: number;
  bootCapMs: number;
  stepMaxMs: number;
  onTrip: (trip: ReviewWatchdogTrip) => void;
}

interface ReviewWatchdog {
  bootActivity: () => void;
  working: (stepLimitMs?: number | null) => void;
  stop: () => void;
}

export type { ReviewWatchdog, ReviewWatchdogOptions, ReviewWatchdogTrip };
