/* @layer electron-main @kind logic */
import type { MainContext } from '../types/main-context.type';
import { servicesState } from './services-state';

const disposeServices = (ctx: Pick<MainContext, 'log'>): void => {
  const services = servicesState.value;
  if (services === null) return;
  servicesState.value = null;
  const dispose: unknown = Reflect.get(services, 'dispose');
  if (typeof dispose !== 'function') return;
  void Promise.resolve()
    .then((): unknown => Reflect.apply(dispose, services, []))
    .catch((err: unknown) => ctx.log(`services dispose failed: ${String(err)}`, 'error'));
};

export { disposeServices };
