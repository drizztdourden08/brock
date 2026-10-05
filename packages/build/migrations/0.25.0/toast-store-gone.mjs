/* @layer tooling-scripts @kind logic */
import { patternTodos } from '../../src/upgrade/index.mjs';

const RULES = [
  {
    pattern: /\b(useToastStore|ToastState)\b/g,
    message: 'useToastStore and ToastState are gone: toasts live in Tessera\'s one queue now. Raise with toast(message, { variant, duration }) and remove with dismissToast(id); Tessera\'s toast.clear() empties the queue. Nothing reads the list any more.',
  },
];

const apply = ({ source }) => ({ source, todos: patternTodos(source, RULES) });

const migration = Object.freeze({
  id: 'toast-store-gone',
  summary: 'Brock 0.25 raises its toasts through Tessera 0.21\'s toast() queue, drawn by one ToastStack. App code that read useToastStore or the ToastState type becomes a to-do.',
  files: /(^|\/)src\/.+\.[jt]sx?$/,
  apply,
});

export { migration };
