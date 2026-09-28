/* @layer electron-main @kind logic */
import type { MainContext } from '@drizztdourden08/brock-electron/main';
import type { SignInProvider, SignInResult } from '../secrets.type';
import type { DeviceSignIn } from './device-sign-in.type';
import type { SignInProviders } from './sign-in-providers.type';
import { createDeviceSignIn } from './device-sign-in';

const createSignInProviders = ({ emit }: Pick<MainContext, 'emit'>): SignInProviders => {
  const drivers = new Map<string, DeviceSignIn>();

  const register = (provider: SignInProvider): (() => void) => {
    drivers.get(provider.id)?.cancel();
    drivers.set(provider.id, createDeviceSignIn(provider));
    return () => {
      drivers.get(provider.id)?.cancel();
      drivers.delete(provider.id);
    };
  };

  const begin = (providerId: string): Promise<SignInResult> => {
    const driver = drivers.get(providerId);
    if (!driver) {
      return Promise.resolve({ ok: false, reason: 'error', message: `No sign-in provider "${providerId}" is registered.` });
    }
    return driver.begin((userCode) => emit('secrets:signIn:code', providerId, userCode));
  };

  const cancel = (providerId: string): void => {
    drivers.get(providerId)?.cancel();
  };

  const cancelAll = (): void => {
    for (const driver of drivers.values()) driver.cancel();
  };

  return { register, begin, cancel, cancelAll };
};

export { createSignInProviders };
