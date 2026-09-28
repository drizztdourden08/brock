/* @layer core @kind types */
interface SettingLock {
  isLocked: (key: string) => boolean;
  keys: ReadonlySet<string>;
}

export type { SettingLock };
