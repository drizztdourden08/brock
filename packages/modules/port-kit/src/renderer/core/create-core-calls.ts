/* @layer renderer-shell @kind logic */
import type { CoreCalls } from '../../port/port-definition.type';
import type { EmscriptenModule } from './emscripten.type';

const argTypesOf = (args: number[]): string[] => args.map(() => 'number');

const createCoreCalls = (mod: EmscriptenModule): CoreCalls => ({
  call: (name, ...args) => {
    mod.ccall(name, null, argTypesOf(args), args);
  },
  number: (name, ...args) => Number(mod.ccall(name, 'number', argTypesOf(args), args)),
  has: (name) => typeof mod[`_${name}`] === 'function',
  heap: () => mod.HEAPU8,
});

export { createCoreCalls };
