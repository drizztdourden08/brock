/* @layer tooling-scripts @kind logic */
import { patternTodos } from '../../src/upgrade/index.mjs';

const RULES = Object.freeze([
  {
    pattern: /\bconnectBridge\b/g,
    message: 'Brock 0.80 moves the helper bridge to protocol 2. A helper built before 0.80 cannot talk to this app: brock build bundles it again from this source, so ship the rebuilt helper with the app and replace any copy installed or configured on its own. A helper that only listens for pushes calls connect() first.',
  },
  {
    pattern: /\.emitTo\(/g,
    message: 'Brock 0.80: bridge.emitTo now returns a count (1 or 0), not a boolean. Compare with 1 where the result is used.',
  },
]);

const apply = ({ source }) => ({ source, todos: patternTodos(source, RULES) });

const migration = Object.freeze({
  id: 'bridge-protocol-2',
  summary: 'Brock 0.80 moves the helper bridge to protocol 2 (an auth step, signed server messages, pushes): every helper that uses connectBridge must be rebuilt and shipped with the app. Each use becomes a to-do.',
  files: /\.[jt]sx?$/,
  apply,
});

export { migration };
