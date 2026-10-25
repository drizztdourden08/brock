/* @layer renderer-shell @kind types */
interface FocusRegionOptions {
  role?: string;
}

interface FocusRegionProps {
  'data-focus-region': string;
  role: string;
  'aria-label': string;
}

export type { FocusRegionOptions, FocusRegionProps };
