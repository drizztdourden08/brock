/* @layer tooling-scripts @kind logic */

const pascal = (id) => id.split('-').map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`).join('');

/**
 * @param {{ id: string, title: string, icon: string | null, component: string, requiresProfile: boolean }} parts
 * @param {string} specifier where the component is imported from, seen from src/screens
 * @returns {string} the source of src/screens/<id>.base.tsx
 */
const baseFileSource = (parts, specifier) => {
  const name = `${pascal(parts.id)}Base`;
  const fields = [`title: '${parts.title.replace(/'/g, "\\'")}'`, ...(parts.icon ? [`icon: '${parts.icon}'`] : []), ...(parts.requiresProfile ? [] : ['requiresProfile: false'])];
  return [
    '/* @layer renderer-app @kind component */',
    "import type { ScreenMeta } from '@drizztdourden08/brock-react';",
    `import { ${parts.component} } from '${specifier}';`,
    '',
    `const meta: ScreenMeta = { ${fields.join(', ')} };`,
    '',
    `const ${name} = () => <${parts.component} />;`,
    '',
    `export default ${name};`,
    'export { meta };',
    '',
  ].join('\n');
};

export { baseFileSource };
