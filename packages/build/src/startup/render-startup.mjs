/* @layer tooling-scripts @kind logic */
import { GENERATED_HEADER, REACT_PACKAGE } from '../screens/screen-conventions.constants.mjs';
import { scanStartup } from './scan-startup.mjs';
import { LAZY_PROMPT, STARTUP_OUTPUT } from './startup-conventions.constants.mjs';

/**
 * @typedef {{ id: string, path: string, shell?: Record<string, unknown> | null }} RenderedPrompt
 */

/** @param {string} id */
const identifierOf = (id) => `${id.replace(/-(.)/g, (_, letter) => letter.toUpperCase())}Prompt`;

/** @param {RenderedPrompt} file */
const sourceOf = (file) => `../${file.path.replace(/\.ts$/, '')}`;

/** @param {RenderedPrompt} file */
const promptOf = (file) => (file.shell ? `${LAZY_PROMPT}(${JSON.stringify(file.shell)}, () => import('${sourceOf(file)}'))` : identifierOf(file.id));

/**
 * @param {RenderedPrompt[]} files
 * @returns {string} the content of .brock/startup.ts
 */
const renderStartup = (files) => {
  const imports = files.filter((file) => !file.shell).map((file) => `import ${identifierOf(file.id)} from '${sourceOf(file)}';`);
  const list = files.length ? ['[', ...files.map((file) => `  { id: '${file.id}', prompt: ${promptOf(file)} },`), ']'].join('\n') : '[]';
  const helpers = [...(files.some((file) => file.shell) ? [LAZY_PROMPT] : []), 'startupPromptsFromFiles'];
  return [
    GENERATED_HEADER,
    `import { ${helpers.join(', ')} } from '${REACT_PACKAGE}';`,
    ...imports,
    '',
    `const appStartupPrompts = startupPromptsFromFiles(${list});`,
    '',
    'export { appStartupPrompts };',
    '',
  ].join('\n');
};

/**
 * @param {string} rootDir the app root
 * @returns {{ path: string, content: string }[]} .brock/startup.ts, always
 */
const renderStartupFiles = (rootDir) => [{ path: STARTUP_OUTPUT, content: renderStartup(scanStartup(rootDir).files.filter((file) => file.hasDefault)) }];

export { renderStartup, renderStartupFiles };
