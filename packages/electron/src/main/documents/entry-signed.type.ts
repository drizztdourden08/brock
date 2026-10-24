/* @layer electron-main @kind types */
type EntrySigner = (key: Buffer, profileId: string, path: string) => string;

export type { EntrySigner };
