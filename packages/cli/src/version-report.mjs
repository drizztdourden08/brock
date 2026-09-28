/* @layer tooling-scripts @kind logic */

/**
 * @param {string} globalVersion
 * @param {import('./find-project-build.mjs').ProjectBuild | null} project
 * @returns {string}
 */
const versionReport = (globalVersion, project) => {
  const lines = [`brock ${globalVersion} (global)`];
  if (project) lines.push(`brock-build ${project.version} (this project, ${project.root})`);
  return `${lines.join('\n')}\n`;
};

export { versionReport };
