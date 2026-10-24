/* @layer tooling-scripts @kind logic */

const KEEPS_ITS_LOOK = /\bshowHeader\b|\bbare\s*:\s*true\b|\bheader\s*:/;

const lineOf = (source) => {
  const at = source.search(/export\s+const\s+meta\b/);
  return at === -1 ? 1 : source.slice(0, at).split('\n').length;
};

const message = (source) => (/\bPageActions\b/.test(source)
  ? 'Brock 0.80 draws no page header on a hub page unless the meta asks for one, and this page fills the header with PageActions. Add showHeader: true to its meta to keep the header and the actions, or make the page bare: true and draw its own.'
  : 'Brock 0.80 draws no page header on a hub page unless the meta asks for one. If this page should keep its big header, add showHeader: true to its meta. To draw the page without the card as well, use bare: true.');

const apply = ({ source }) => ({ source, todos: KEEPS_ITS_LOOK.test(source) ? [] : [{ line: lineOf(source), message: message(source) }] });

const migration = Object.freeze({
  id: 'hub-page-header-off',
  summary: 'Brock 0.80 turns the big page header off on hub pages. Each hub page and custom page without a header, showHeader or bare in its meta becomes a to-do to add showHeader: true if the header is wanted.',
  files: /(^|\/)src\/screens\/.+\.(?:page|custom)(?:\.dev)?\.tsx?$/,
  apply,
});

export { migration };
