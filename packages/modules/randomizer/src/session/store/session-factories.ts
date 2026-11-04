/* @layer core @kind logic */
import type { SessionFactory } from '../local/session-factory.type';

const sessionFactories = new Map<string, SessionFactory>();

export { sessionFactories };
