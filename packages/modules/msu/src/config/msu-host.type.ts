/* @layer core @kind types */
interface MsuHost {
  audioTarget: () => { ctx: AudioContext; node: AudioNode } | null;
  setExternalMusic: (on: boolean) => void;
  restoreCoreMusic: () => void;
  announceCoreMusic?: () => void;
  setVariant?: (name: string | null) => void;
  setExternalSounds?: (bus: 'ambient' | 'sfx', on: boolean) => void;
  setSoundClaim: (coreIndex: number, low: number, high: number) => void;
  setSoundTrace?: (on: boolean) => void;
  onCoreRunning?: (cb: () => void) => () => void;
  renderOriginalSound?: (
    target: string,
    id: number,
    seconds: number,
  ) => { samples: Int16Array; sampleRate: number } | null;
}

export type { MsuHost };
