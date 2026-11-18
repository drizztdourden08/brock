/* @layer electron-main @kind types */
interface SplashProgressView {
  fraction: number;
  label: string;
  detail: string | null;
}

interface SplashFailureView {
  label: string;
  message: string;
  timedOut: boolean;
}

type SplashTexts = Record<string, string>;

interface SplashBridge {
  onText: (listener: (texts: SplashTexts) => void) => void;
  onProgress: (listener: (view: SplashProgressView) => void) => void;
  onFailure: (listener: (view: SplashFailureView) => void) => void;
  retry: () => void;
  quit: () => void;
  openLogs: () => void;
}

export type { SplashBridge, SplashFailureView, SplashProgressView, SplashTexts };
