/* @layer tooling-scripts @kind logic */
const generated = [
  'public/logos/icon.ico',
  'public/logos/icon-bot.svg',
  'public/logos/icon-bot.ico',
  'public/logos/icon-bot-256.png',
  'build/installer-splash.png',
  '.brock/profile-config.json',
];

const apply = ({ source }) => {
  const eol = source.includes('\r\n') ? '\r\n' : '\n';
  const present = new Set(source.split(/\r?\n/).map((line) => line.trim()));
  const missing = generated.filter((entry) => !present.has(entry));
  if (missing.length === 0) return { source, todos: [] };
  const body = source.length === 0 || source.endsWith('\n') ? source : `${source}${eol}`;
  return { source: `${body}${missing.join(eol)}${eol}`, todos: [] };
};

const migration = Object.freeze({
  id: 'gitignore-generated-files',
  summary: 'brock icons now writes the bot logos and the installer splash, and the profile store sits in .brock; git ignores them.',
  files: /^\.gitignore$/,
  apply,
});

export { migration };
