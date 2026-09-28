/* @layer core @kind logic */
import type { PortDefinition } from './port-definition.type';

const definePort = <S>(definition: PortDefinition<S>): PortDefinition<S> => definition;

export { definePort };
