/* @layer tooling-scripts @kind logic */
const plainAbout = /^\s*\{\s*key:\s*['"]about['"],\s*label:\s*['"]About['"],\s*screen:\s*['"]about['"],?\s*\},?\s*$/;
const opensAbout = /\bscreen:\s*['"]about['"]/;

const apply = ({ source }) => {
  const todos = [];
  const kept = source.split('\n').filter((line, index) => {
    if (plainAbout.test(line)) return false;
    if (opensAbout.test(line) && !/\bicon\s*:/.test(line)) {
      todos.push({ line: index + 1, message: 'This menu entry opens the About screen and replaces the built-in About entry, which has an icon. Delete it, or give it an icon.' });
    }
    return true;
  });
  return { source: kept.join('\n'), todos };
};

const migration = Object.freeze({
  id: 'menu-built-in-about',
  summary: 'The shell menu has its own About entry; an app entry for the About screen replaces it and loses its icon.',
  files: /\.[jt]sx?$/,
  apply,
});

export { migration };
