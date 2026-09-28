/* @layer renderer-shell @kind types */
interface LiveSettings<S> {
  push: (settings: S) => boolean;
  reassert: () => boolean;
  last: () => S | null;
}

export type { LiveSettings };
