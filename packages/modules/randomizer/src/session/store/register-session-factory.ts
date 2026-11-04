/* @layer core @kind logic */
import type { SessionFactory } from '../local/session-factory.type';
import { sessionFactories } from './session-factories';

const registerSessionFactory = (factory: SessionFactory): void => {
  sessionFactories.set(factory.mode, factory);
};

export { registerSessionFactory };
