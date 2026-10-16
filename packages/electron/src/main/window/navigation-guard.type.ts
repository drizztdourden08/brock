/* @layer electron-main @kind types */
interface NavigatingContents {
  getURL: () => string;
  on: (event: 'will-navigate', listener: (event: { preventDefault: () => void }, url: string) => void) => unknown;
}

export type { NavigatingContents };
