/* @layer core @kind logic */
import type { ProductInput } from './product.type';
import { FILE_EXTENSION, PROG_ID, RESERVED_SCHEMES, URL_SCHEME } from './os-integration.constants';

const assertScheme = (field: string, scheme: string): void => {
  if (!URL_SCHEME.test(scheme)) throw new Error(`product.${field} scheme "${scheme}" must be lower case like "my-app", with no "://"`);
  if (RESERVED_SCHEMES.includes(scheme)) throw new Error(`product.${field} scheme "${scheme}" belongs to the browser`);
};

const assertUnique = (field: string, values: readonly string[]): void => {
  const twice = values.find((value, index) => values.indexOf(value) !== index);
  if (twice !== undefined) throw new Error(`product.${field} lists "${twice}" twice`);
};

const assertServedDir = (scheme: string, dir: string | undefined): void => {
  if (dir === undefined) return;
  const parts = dir.split(/[\\/]+/);
  if (!dir.trim() || /^[a-z]:|^[\\/]/i.test(dir) || parts.includes('..')) {
    throw new Error(`product.schemes "${scheme}" dir "${dir}" must be a folder inside Data/, like "sprites"`);
  }
};

const assertOsIntegration = (input: ProductInput): void => {
  const { schemes = [], protocols = [], fileAssociations = [] } = input;
  for (const { scheme, dir } of schemes) {
    assertScheme('schemes', scheme);
    assertServedDir(scheme, dir);
  }
  for (const { scheme } of protocols) assertScheme('protocols', scheme);
  for (const { ext, progId } of fileAssociations) {
    if (!FILE_EXTENSION.test(ext)) throw new Error(`product.fileAssociations ext "${ext}" must be an extension with no dot, like "msul"`);
    if (!PROG_ID.test(progId)) throw new Error(`product.fileAssociations progId "${progId}" must look like "MyApp.Document"`);
  }
  assertUnique('schemes', schemes.map(({ scheme }) => scheme));
  assertUnique('protocols', protocols.map(({ scheme }) => scheme));
  assertUnique('fileAssociations', fileAssociations.map(({ ext }) => ext.toLowerCase()));
};

export { assertOsIntegration };
