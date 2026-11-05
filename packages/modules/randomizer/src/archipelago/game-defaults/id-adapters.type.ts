/* @layer core @kind types */
interface IdAdapters {
  locationIdOf(key: string): number | null;
  locationKeyOf(id: number, name: string): string | null;
}

export type { IdAdapters };
