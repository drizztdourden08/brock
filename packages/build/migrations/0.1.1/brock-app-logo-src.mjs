/* @layer tooling-scripts @kind logic */
import { findJsxProps, removeSpans } from '../../src/upgrade/index.mjs';

const defaults = { logoSrc: './logos/icon-256.png', instanceLogoSrc: './logos/icon-bot.svg' };
const logoField = { logoSrc: 'app', instanceLogoSrc: 'instance' };

const isDefault = ({ name, literal }) => literal === defaults[name];

const todoFor = ({ name, line, literal }) => ({
  line,
  message: literal === null
    ? `BrockApp gets ${name} from an expression. BrockApp no longer takes it: set product.logos.${logoField[name]} to that path, then delete the prop and anything that only fed it.`
    : `BrockApp gets ${name}="${literal}". BrockApp no longer takes it: set product.logos.${logoField[name]} to "${literal}", then delete the prop.`,
});

const apply = ({ source }) => {
  const props = findJsxProps(source, 'BrockApp', Object.keys(defaults));
  return {
    source: removeSpans(source, props.filter(isDefault)),
    todos: props.filter((prop) => !isDefault(prop)).map(todoFor),
  };
};

const migration = Object.freeze({
  id: 'brock-app-logo-src',
  summary: 'BrockApp no longer takes logoSrc or instanceLogoSrc; the shell reads them from product.logos.',
  files: /\.[jt]sx$/,
  apply,
});

export { migration };
