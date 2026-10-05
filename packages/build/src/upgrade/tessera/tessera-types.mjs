/* @layer tooling-scripts @kind logic */
import { tesseraOwned } from './tessera-owned.mjs';

const PROPS_SUFFIX = 'Props';

const constituents = (type) => (type.isUnionOrIntersection() ? type.types.flatMap(constituents) : [type]);

const fromTessera = (symbol) => symbol?.declarations?.some((declaration) => tesseraOwned(declaration.getSourceFile().fileName)) === true;

const ownerNames = (type) =>
  new Set((type ? constituents(type) : []).flatMap((part) => [part.aliasSymbol, part.getSymbol()]).filter(fromTessera).map((symbol) => symbol.getName()));

const declaredType = (checker, object) => checker.getContextualType(object) ?? checker.getTypeAtLocation(object);

const owns = (owners, name) => owners.has(name) || owners.has(`${name}${PROPS_SUFFIX}`);

const takes = (checker, type, prop) => constituents(type).some((part) => checker.getPropertyOfType(part, prop) !== undefined);

/**
 * @param {import('typescript').TypeChecker} checker
 * @param {import('typescript').Node} node a JSX attributes node or an object literal
 * @param {Set<string> | null} keep RENAMES.json's list, used when the type is unknown
 * @returns {(prop: string) => boolean | null} the props type still takes it; null when unknown
 */
const propsAcceptor = (checker, node, keep) => {
  const type = checker.getContextualType(node);
  if (ownerNames(type).size > 0) return (prop) => takes(checker, type, prop);
  return keep ? (prop) => keep.has(prop) : () => null;
};

const tesseraTypes = Object.freeze({ ownerNames, declaredType, owns, takes, propsAcceptor });

export { tesseraTypes };
