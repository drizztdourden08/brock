/* @layer tooling-scripts @kind logic */

const BOOTING_COMMENT = /\s*<!--(?:(?!-->)[\s\S])*?\bbooting\b(?:(?!-->)[\s\S])*?-->/;
const SPLASH_COMMENT = /\s*<!--(?:(?!-->)[\s\S])*?[Bb]oot splash(?:(?!-->)[\s\S])*?-->/;
const SPLASH_STYLE = /\s*<style>(?:(?!<\/style>)[\s\S])*?#boot-splash(?:(?!<\/style>)[\s\S])*?<\/style>/;
const ROOT_WITH_SPLASH = /<div id="root">\s*<div id="boot-splash">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/;
const HTML_CLASS = /<html\b([^>]*?)\sclass="([^"]*)"/i;

const dropBootingClass = (source) =>
  source.replace(HTML_CLASS, (match, before, classes) => {
    const kept = classes.split(/\s+/).filter((name) => name && name !== 'booting');
    return kept.length ? `<html${before} class="${kept.join(' ')}"` : `<html${before}`;
  });

const lineOf = (source, pattern) => {
  const index = source.search(pattern);
  return index < 0 ? null : source.slice(0, index).split('\n').length;
};

const apply = ({ source }) => {
  let next = dropBootingClass(source)
    .replace(BOOTING_COMMENT, '')
    .replace(SPLASH_COMMENT, '')
    .replace(SPLASH_STYLE, '')
    .replace(ROOT_WITH_SPLASH, '<div id="root"></div>');
  const leftover = /boot-splash|\bbooting\b/.test(next);
  if (leftover) next = source;
  const todos = leftover
    ? [{ line: lineOf(source, /boot-splash|\bbooting\b/), message: 'src/index.html still holds a hand-written boot splash. The splash window is now the only loading screen: remove the booting class, the #boot-splash style and markup, and leave <div id="root"></div> empty.' }]
    : [];
  return { source: next, todos };
};

const migration = Object.freeze({
  id: 'index-boot-splash',
  summary: 'The app window has no loading screen of its own any more; the hand-written boot splash leaves src/index.html.',
  files: /(^|\/)src\/index\.html$/,
  apply,
});

export { migration };
