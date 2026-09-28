/* @layer core @kind types */
interface SecretMeta {
  name: string;
  createdAt: number;
  updatedAt: number;
  label?: string;
}

type SignInStatus = 'pending' | 'confirmed' | 'denied' | 'expired' | 'used';

type SignInFailure = 'denied' | 'expired' | 'cancelled' | 'unavailable' | 'error';

type SignInResult = { ok: true } | { ok: false; reason: SignInFailure; message?: string };

interface SignInBegin {
  id: string;
  userCode: string;
  verifyUrl: string;
  pollSecret: string;
}

interface SignInPoll {
  status: SignInStatus;
  token?: string;
}

interface DeviceSignInOptions {
  begin: () => Promise<SignInBegin>;
  poll: (id: string, pollSecret: string) => Promise<SignInPoll>;
  onToken: (token: string) => void | Promise<void>;
  pollMs?: number;
  ttlMs?: number;
  openUrl?: (url: string) => Promise<void>;
}

interface SignInProvider extends DeviceSignInOptions {
  id: string;
}

type SignInCodeListener = (providerId: string, userCode: string) => void;

interface SecretsSignInApi {
  begin: (providerId: string) => Promise<SignInResult>;
  cancel: (providerId: string) => Promise<void>;
  onCode: (listener: SignInCodeListener) => () => void;
}

interface SecretsApi {
  set: (name: string, value: string, label?: string) => Promise<void>;
  has: (name: string) => Promise<boolean>;
  list: () => Promise<SecretMeta[]>;
  delete: (name: string) => Promise<void>;
  canStore: () => Promise<boolean>;
  signIn: SecretsSignInApi;
}

export type {
  SecretMeta, SignInStatus, SignInFailure, SignInResult, SignInBegin, SignInPoll,
  DeviceSignInOptions, SignInProvider, SignInCodeListener, SecretsSignInApi, SecretsApi,
};
