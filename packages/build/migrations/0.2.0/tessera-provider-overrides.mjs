/* @layer tooling-scripts @kind logic */
import { findJsxProps, patternTodos } from '../../src/upgrade/index.mjs';

const RULES = Object.freeze([
  {
    pattern: /\bAboutPanelCopy\b/g,
    message: 'AboutPanelCopy is gone from Tessera. Give the clipboard writer to TesseraProvider once: overrides={{ writeText }}.',
  },
  {
    pattern: /\bPortalDocumentContext\b/g,
    message: 'PortalDocumentContext is gone from Tessera. <PortalDocumentContext value={doc}> becomes <TesseraProvider overrides={{ portalDocument: doc }}>.',
  },
]);

const copyTodo = ({ line }) => ({
  line,
  message: 'AboutPanel no longer takes onCopy. Its copy button writes through TesseraProvider overrides={{ writeText }}, which BrockApp already sets to writeClipboard. Drop onCopy.',
});

const apply = ({ source }) => ({
  source,
  todos: [...findJsxProps(source, 'AboutPanel', ['onCopy']).map(copyTodo), ...patternTodos(source, RULES)],
});

const migration = Object.freeze({
  id: 'tessera-provider-overrides',
  summary: 'TesseraProvider overrides carry the clipboard writer and the portal document; AboutPanel onCopy, AboutPanelCopy and PortalDocumentContext become to-dos.',
  files: /\.[jt]sx?$/,
  apply,
});

export { migration };
