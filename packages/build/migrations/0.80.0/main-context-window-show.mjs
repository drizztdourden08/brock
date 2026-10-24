/* @layer tooling-scripts @kind logic */
import { patternTodos } from '../../src/upgrade/index.mjs';

const FLAGS_MESSAGE = 'Brock 0.80 added isBackgroundLaunch to AutomationFlags. Add `isBackgroundLaunch: () => false,` next to isHeadlessLaunch in this hand-built flags object.';
const WINDOW_MESSAGE = 'Brock 0.80 made ctx.window a function with a show() method. Wrap this hand-built window in Object.assign(() => win, { show: () => Promise.resolve() }), or give it a show member.';

const openingBrace = (source, index) => {
  let depth = 0;
  for (let i = index; i >= 0; i -= 1) {
    if (source[i] === '}') depth += 1;
    if (source[i] === '{') depth -= 1;
    if (depth < 0) return i;
  }
  return -1;
};

const enclosing = (source, index) => {
  const start = openingBrace(source, index);
  if (start < 0) return null;
  let depth = 0;
  for (let i = start; i < source.length; i += 1) {
    if (source[i] === '{') depth += 1;
    if (source[i] === '}') depth -= 1;
    if (depth === 0) return source.slice(start, i + 1);
  }
  return source.slice(start);
};

const lineAt = (source, index) => source.slice(0, index).split('\n').length;

const flagTodos = (source) =>
  [...source.matchAll(/\bisHeadlessLaunch\s*:/g)]
    .filter((match) => !/\bisBackgroundLaunch\s*:/.test(enclosing(source, match.index) ?? ''))
    .map((match) => ({ line: lineAt(source, match.index), message: FLAGS_MESSAGE }));

const WINDOW_RULES = Object.freeze([
  {
    pattern: /\bwindow\s*:\s*(?:async\s*)?(?:\(\s*\)|function\b)(?![^\n]*\bshow\b)/g,
    near: /\bMainContext\b/,
    message: WINDOW_MESSAGE,
  },
]);

const apply = ({ source }) => ({ source, todos: [...flagTodos(source), ...patternTodos(source, WINDOW_RULES)] });

const migration = Object.freeze({
  id: 'main-context-window-show',
  summary: 'Brock 0.80 adds isBackgroundLaunch to AutomationFlags and a show() method to ctx.window. Each hand-built flags object that has isHeadlessLaunch but no isBackgroundLaunch, and each hand-built MainContext window function without show, becomes a to-do.',
  files: /\.[jt]sx?$/,
  apply,
});

export { migration };
