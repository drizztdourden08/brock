/* @layer core @kind types */
interface DeathLinkGuard {
  markSent(): number;
  markKilled(): void;
  sentRecently(): boolean;
  killedRecently(): boolean;
}

export type { DeathLinkGuard };
