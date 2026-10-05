/* @layer renderer-shell @kind types */
interface TourHostProps {
  ready: boolean;
}

interface KeptUsable {
  made: readonly HTMLElement[];
  lifted: readonly HTMLElement[];
}

export type { KeptUsable, TourHostProps };
