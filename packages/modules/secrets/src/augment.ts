/* @layer core @kind types */
import type { SecretMeta, SecretsApi, SignInResult } from './secrets.type';

declare module '@drizztdourden08/brock-core/augment' {
  interface InvokeContract {
    'secrets:set': (name: string, value: string, label?: string) => Promise<void>;
    'secrets:has': (name: string) => Promise<boolean>;
    'secrets:list': () => Promise<SecretMeta[]>;
    'secrets:delete': (name: string) => Promise<void>;
    'secrets:canStore': () => Promise<boolean>;
    'secrets:signIn:begin': (providerId: string) => Promise<SignInResult>;
    'secrets:signIn:cancel': (providerId: string) => Promise<void>;
  }

  interface EventContract {
    'secrets:signIn:code': (providerId: string, userCode: string) => void;
  }

  interface IpcNamespaces {
    secrets: SecretsApi;
  }
}
