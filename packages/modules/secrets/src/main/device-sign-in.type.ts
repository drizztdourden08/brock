/* @layer electron-main @kind types */
import type { SignInResult } from '../secrets.type';

type CodeListener = (userCode: string, verifyUrl: string) => void;

interface DeviceSignIn {
  begin: (onCode: CodeListener) => Promise<SignInResult>;
  cancel: () => void;
  isRunning: () => boolean;
}

export type { DeviceSignIn, CodeListener };
