/* @layer tooling-scripts @kind logic */
import { TEMPLATE_VIEWS } from './site.constants.mjs';

const pascalOf = (name) => name.split('-').filter(Boolean).map((word) => `${word[0].toUpperCase()}${word.slice(1)}`).join('');

/**
 * @param {string} name the site name, a lowercase word with dashes
 * @returns {Record<string, string>} view names unique to this site
 */
const siteViewValues = (name) => {
  const pascal = pascalOf(name);
  return Object.fromEntries(Object.entries(TEMPLATE_VIEWS).flatMap(([key, view]) => [
    [key, `${pascal}${view.part}`],
    [`${key}_CLASS`, `${name}-${view.block}`],
  ]));
};

/**
 * @param {string} target a template path, from the template folder
 * @param {Record<string, string>} values from siteViewValues
 * @returns {string} the path with the site's view names
 */
const siteViewPath = (target, values) => target.split('/').map((segment) => {
  const view = Object.entries(TEMPLATE_VIEWS).find(([, { folder }]) => segment === folder || segment.startsWith(`${folder}.`));
  return view ? `${values[view[0]]}${segment.slice(view[1].folder.length)}` : segment;
}).join('/');

export { siteViewPath, siteViewValues };
