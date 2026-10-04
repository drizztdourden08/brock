/* @layer tooling-scripts @kind logic */

const IMPORT = /import\s*(?:type\s*)?\{([^}]*)\}\s*from\s*['"]@drizztdourden08\/brock-updater\/renderer['"]/g;

const MESSAGE = 'UpdateBadge is no longer exported by brock-updater. BrockApp draws the update as a title bar status action; '
  + 'an app with its own title bar uses useUpdateAction from @drizztdourden08/brock-updater/renderer.';

const lineAt = (source, index) => source.slice(0, index).split('\n').length;

const importsBadge = (list) => list.split(',').some((part) => part.trim().split(/\s+as\s+/)[0].trim() === 'UpdateBadge');

const apply = ({ source }) => {
  const todos = [...source.matchAll(IMPORT)].filter((match) => importsBadge(match[1])).map((match) => ({ line: lineAt(source, match.index), message: MESSAGE }));
  return { source, todos };
};

const migration = Object.freeze({
  id: 'update-badge-removed',
  summary: 'brock-updater no longer exports UpdateBadge; an import of it becomes a to-do naming useUpdateAction.',
  files: /\.[jt]sx?$/,
  apply,
});

export { migration };
