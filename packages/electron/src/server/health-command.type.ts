/* @layer electron-main @kind types */
interface HealthCommandInput {
  dataDir: string;
  now: number;
  print: (line: string) => void;
}

export type { HealthCommandInput };
