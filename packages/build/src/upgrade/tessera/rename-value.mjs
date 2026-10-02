/* @layer tooling-scripts @kind logic */
import { CLASS_NAME, CUSTOM_PROPERTY, IDENTIFIER, LITERAL_VALUE, PROP_PATH } from './tessera-renames.constants.mjs';

const isString = (value) => typeof value === 'string';

const propPath = (value) => {
  const match = isString(value) ? PROP_PATH.exec(value) : null;
  return match ? { component: match[1], prop: match[2] } : null;
};

const renameValue = Object.freeze({
  identifier: (value) => isString(value) && IDENTIFIER.test(value),
  customProperty: (value) => isString(value) && CUSTOM_PROPERTY.test(value),
  classes: (value) => isString(value) && value.split(' ').every((name) => CLASS_NAME.test(name)),
  literal: (value) => isString(value) && LITERAL_VALUE.test(value),
  propPath,
});

export { renameValue };
