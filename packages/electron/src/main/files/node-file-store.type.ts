/* @layer electron-main @kind types */
interface NodeFileStoreOptions {
  trashItem?: (fullPath: string) => Promise<void>;
}

export type { NodeFileStoreOptions };
