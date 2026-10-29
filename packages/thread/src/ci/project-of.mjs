/* @layer tooling-scripts @kind logic */
const PROJECT_NAME = /^[\w.-]+$/;

/**
 * @param {Record<string, string | boolean>} options
 * @param {import('../workspace/workspace.type.mjs').Workspace} workspace
 * @returns {string}
 */
const projectOf = (options, workspace) => {
  const project = String(typeof options.project === 'string' ? options.project : (process.env.COORD_PROJECT ?? workspace.name));
  if (!PROJECT_NAME.test(project)) throw new Error(`"${project}" is not a project name (letters, digits, dots, dashes).`);
  return project;
};

export { projectOf };
