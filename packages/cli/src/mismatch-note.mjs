/* @layer tooling-scripts @kind logic */

const majorOf = (version) => String(version).split('.')[0];

/**
 * @param {import('./find-project-build.mjs').ProjectBuild | null} project
 * @param {string} globalBuildVersion the brock-build this global carries
 * @returns {string | null}
 */
const mismatchNote = (project, globalBuildVersion) => {
  if (!project || majorOf(project.version) === majorOf(globalBuildVersion)) return null;
  const major = majorOf(project.version);
  return `brock: this project pins brock-build ${project.version}, the global carries ${globalBuildVersion}. To match: npm install -g @drizztdourden08/brock@${major}\n`;
};

export { mismatchNote };
