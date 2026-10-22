/* @layer electron-main @kind types */
interface PadGate {
  claim: (headless: boolean) => boolean;
  release: () => void;
}

export type { PadGate };
