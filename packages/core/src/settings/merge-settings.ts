/* @layer core @kind logic */
const mergeSettings = <S extends object>(defaults: S, stored: Partial<S> | null | undefined): S =>
  ({ ...defaults, ...(stored ?? {}) });

export { mergeSettings };
