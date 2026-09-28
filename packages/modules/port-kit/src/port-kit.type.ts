/* @layer core @kind types */
interface PortKitApi {
  readCore: (file: string) => Promise<ArrayBuffer | null>;
}

export type { PortKitApi };
