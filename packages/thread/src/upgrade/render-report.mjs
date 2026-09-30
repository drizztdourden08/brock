/* @layer tooling-scripts @kind logic */

const section = (title, lines) => ['', `## ${title}`, '', ...lines];

const listOr = (items, empty) => (items.length > 0 ? items.map((item) => `- ${item}`) : [empty]);

const modeLine = (plan) => (plan.mode === 'link' ? `linked checkout ${plan.checkout}` : 'registry');

const stepRows = (steps) => [
  '| Step | Result |',
  '| --- | --- |',
  ...steps.map((step) => `| ${step.name} | ${step.status}${step.detail ? `: ${step.detail}` : ''} |`),
];

const migrationLines = (run, range) => {
  if (!run) return ['The migrations did not run.'];
  if (run.applied.length === 0) return [`No migration applies between ${range}.`];
  return run.applied.flatMap((m) => [
    `- ${m.version} ${m.id} (${m.source}): ${m.summary}`,
    ...(m.touched.length > 0 ? m.touched.map((file) => `  - ${file}`) : ['  - no file needed it']),
  ]);
};

const todoLines = (run) => {
  if (!run || run.todos.length === 0) return ['Nothing is left to do by hand.'];
  return run.todos.map((todo) => `${todo.number}. ${todo.file}${todo.line ? `:${todo.line}` : ''} (${todo.migration}): ${todo.message}`);
};

const changelogLines = (changelog) => {
  if (changelog.length === 0) return ['No changelog entry was found for this range.'];
  return changelog.flatMap(({ version, entries }) => [`### ${version}`, '', ...listOr(entries, 'No entries.'), '']).slice(0, -1);
};

/**
 * @param {{ app: string, plan: import('./upgrade.type.mjs').UpgradePlan, worktree: { path: string, branch: string } }} head
 * @param {{ fields: string[], steps: import('./upgrade.type.mjs').StepResult[], failed: string | null }} outcome
 * @param {{ migrations: import('./upgrade.type.mjs').MigrationRun | null, changelog: { version: string, entries: string[] }[] }} detail
 * @returns {string} the upgrade-report.md body
 */
const renderReport = ({ app, plan, worktree }, { fields, steps, failed }, { migrations, changelog }) => {
  const range = `${plan.current ?? 'unknown'} and ${plan.target}`;
  return [
    `# Brock upgrade: ${plan.current ?? 'unknown'} to ${plan.target}`,
    '',
    `- App: ${app}`,
    `- Brock from: ${modeLine(plan)}`,
    `- Worktree: ${worktree.path} on ${worktree.branch}`,
    `- Result: ${failed ? `red, the ${failed} step failed` : 'green'}`,
    ...section('package.json', listOr(fields, 'No field changed.')),
    ...section('Steps', stepRows(steps)),
    ...section('Migrations', migrationLines(migrations, range)),
    ...section('To do by hand', todoLines(migrations)),
    ...section('Changelog', changelogLines(changelog)),
    '',
  ].join('\n');
};

export { renderReport };
