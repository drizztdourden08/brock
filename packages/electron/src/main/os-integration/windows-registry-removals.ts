/* @layer electron-main @kind logic */
import type { OsIntegrationProduct, RegistryRemoval } from './os-integration.type';
import { CLASSES_KEY } from './os-integration.constants';

const windowsRegistryRemovals = (product: OsIntegrationProduct): RegistryRemoval[] => [
  ...product.protocols.map(({ scheme }) => ({ key: `${CLASSES_KEY}\\${scheme}`, name: null })),
  ...product.fileAssociations.flatMap(({ ext, progId }) => [
    { key: `${CLASSES_KEY}\\.${ext.toLowerCase()}\\OpenWithProgids`, name: progId },
    { key: `${CLASSES_KEY}\\${progId}`, name: null },
  ]),
];

export { windowsRegistryRemovals };
