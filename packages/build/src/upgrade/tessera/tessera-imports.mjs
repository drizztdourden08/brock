/* @layer tooling-scripts @kind logic */
import { TESSERA_IMPORT } from './tessera-renames.constants.mjs';

const fromTessera = (ts, statement) =>
  (ts.isImportDeclaration(statement) || ts.isExportDeclaration(statement))
  && statement.moduleSpecifier !== undefined
  && ts.isStringLiteral(statement.moduleSpecifier)
  && TESSERA_IMPORT.test(statement.moduleSpecifier.text);

const namedOf = (ts, statement) => {
  const named = ts.isImportDeclaration(statement) ? statement.importClause?.namedBindings : statement.exportClause;
  return named && (ts.isNamedImports(named) || ts.isNamedExports(named)) ? named : null;
};

/**
 * @param {typeof import('typescript')} ts
 * @param {import('typescript').SourceFile} file
 * @returns {{ imported: string, local: string, specifier: any, declaration: any, reexport: boolean }[]} from Tessera
 */
const tesseraImports = (ts, file) =>
  file.statements
    .filter((statement) => fromTessera(ts, statement))
    .flatMap((statement) =>
      (namedOf(ts, statement)?.elements ?? []).map((specifier) => ({
        imported: (specifier.propertyName ?? specifier.name).text,
        local: specifier.name.text,
        specifier,
        declaration: statement,
        reexport: ts.isExportDeclaration(statement),
      })));

export { tesseraImports };
