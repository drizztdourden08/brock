/* @layer renderer-shell @kind logic */
const defined = <K extends string, V>(key: K, value: V | undefined): Partial<Record<K, V>> =>
  (value === undefined ? {} : ({ [key]: value } as Partial<Record<K, V>>));

export { defined };
