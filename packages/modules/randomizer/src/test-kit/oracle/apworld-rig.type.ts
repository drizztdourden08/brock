/* @layer core @kind types */
interface ApworldRigConfig {
  apDir: string;
  root: string;
  buildScript: string;
  worldModuleName: string;
  supportedVersions: readonly string[];
  builtPackagePath(version: string): string;
  readSpoiler(archive: Buffer): Promise<string | null>;
  tempPrefix: string;
}

interface GenerationRun {
  ok: boolean;
  log: string;
  spoiler: string | null;
}

interface ApworldRig {
  hasArchipelago(): boolean;
  installedVersion(): string;
  supportsInstalledVersion(): boolean;
  installWorldPackage(): string;
  generate(yaml: string, seed: number, extra?: readonly string[]): Promise<GenerationRun>;
}

export type { ApworldRig, ApworldRigConfig, GenerationRun };
