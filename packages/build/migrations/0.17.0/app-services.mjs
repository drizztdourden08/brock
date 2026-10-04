/* @layer tooling-scripts @kind logic */
import { patternTodos } from '../../src/upgrade/index.mjs';

const RULES = [{
  pattern: /new\s+WeakMap<\s*MainContext\b/g,
  message: 'Main now has a place for app services: bootstrapApp({ services: (ctx) => createAppServices(ctx) }) builds them once, after the paths and before the handlers, and every handler reads ctx.services. Type it with declare module \'@drizztdourden08/brock-core/augment\' { interface AppServices extends ReturnType<typeof createAppServices> {} }. A dispose() on the services runs on will-quit. Once handlers read ctx.services, this per-context memo and its onWillQuit cleanup can go.',
}];

const apply = ({ source }) => ({ source, todos: patternTodos(source, RULES) });

const migration = Object.freeze({
  id: 'app-services',
  summary: 'bootstrapApp takes services: (ctx) => AppServices, exposed as ctx.services and disposed on will-quit. A WeakMap memo keyed by MainContext becomes a to-do naming it.',
  files: /(^|\/)electron\/.+\.ts$/,
  apply,
});

export { migration };
