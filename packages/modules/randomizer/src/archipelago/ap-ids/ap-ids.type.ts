/* @layer core @kind types */
interface ApIdLookup<L extends string, I extends string> {
  locationIdOf(key: L): number;
  itemIdOf(key: I): number;
  locationKeyOf(id: number): L | undefined;
  itemKeyOf(id: number): I | undefined;
}

export type { ApIdLookup };
