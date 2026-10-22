/* @layer electron-main @kind types */
interface PadHolder {
  pid: number;
  product: string;
  since: string;
}

type PadClaim = { ok: true } | { ok: false; holder: PadHolder };

interface PadLockOptions {
  product: string;
  dir?: string;
  pid?: number;
  isAlive?: (pid: number) => boolean;
}

interface PadLock {
  claim: (takeOver: boolean) => PadClaim;
  release: () => void;
}

export type { PadHolder, PadClaim, PadLockOptions, PadLock };
