/* @layer core @kind types */
type SaveArchipelagoFilesRequest = {
  slotName: string;
  yaml: string;
  apworld: ArrayBuffer;
  moduleName: string;
};

type SaveArchipelagoFilesResult =
  | { ok: true; folder: string; files: string[] }
  | { ok: false; reason: string };

export type { SaveArchipelagoFilesRequest, SaveArchipelagoFilesResult };
