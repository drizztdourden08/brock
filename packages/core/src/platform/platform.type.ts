/* @layer core @kind types */
import type { Capabilities, PlatformPorts } from '../augment';

type HostShell = 'electron' | 'capacitor' | 'web';
type OsKind = 'windows' | 'macos' | 'linux' | 'android' | 'ios' | 'unknown';
type FormFactor = 'desktop' | 'mobile';
type InputModel = 'pointer' | 'touch' | 'hybrid';

interface PlatformInfo {
  host: HostShell;
  os: OsKind;
  formFactor: FormFactor;
  input: InputModel;
  isDev: boolean;
}

type Platform = { info: PlatformInfo; capabilities: Capabilities } & PlatformPorts;

export type { HostShell, OsKind, FormFactor, InputModel, PlatformInfo, Platform };
