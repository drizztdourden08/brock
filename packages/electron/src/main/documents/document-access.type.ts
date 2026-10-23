/* @layer electron-main @kind types */
interface DocumentAccess {
  allow: (path: string) => string;
  isAllowed: (path: string) => boolean;
  resolve: (path: string) => string;
}

export type { DocumentAccess };
