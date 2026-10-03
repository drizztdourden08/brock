/* @layer tooling-scripts @kind logic */
const TESSERA = /['"]@drizztdourden08\/tessera(?:\/[\w-]+)?['"]/;

const TYPE_RENAMES = Object.freeze([
  [/\bHeroFactRow\b/g, 'FactsPanelGroup'],
  [/\bHeroFact\b/g, 'FactsPanelFact'],
]);

const CLASS_RENAMES = Object.freeze([
  [/\bhero__fact-row\b/g, 'facts-panel__group'],
  [/\bhero__facts\b/g, 'facts-panel'],
  [/\bhero__fact\b(?!-)/g, 'facts-panel__fact'],
  [/--hero-fact-max-w\b/g, '--facts-panel-value-max-w'],
]);

const renameAll = (source, renames) => renames.reduce((text, [pattern, name]) => text.replace(pattern, name), source);

const apply = ({ path, source }) => {
  const classes = renameAll(source, CLASS_RENAMES);
  const typed = !path.endsWith('.css') && TESSERA.test(source);
  return { source: typed ? renameAll(classes, TYPE_RENAMES) : classes, todos: [] };
};

const migration = Object.freeze({
  id: 'facts-panel-names',
  summary: 'Hero draws its facts with FactsPanel: HeroFact and HeroFactRow become FactsPanelFact and FactsPanelGroup, and the .hero__fact classes and --hero-fact-max-w become the .facts-panel ones.',
  files: /\.(?:[jt]sx?|css)$/,
  apply,
});

export { migration };
