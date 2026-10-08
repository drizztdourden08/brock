/* @layer electron-main @kind logic */
import type { FileIconOf, OsIntegrationProduct, RegistryValue } from './os-integration.type';
import { CLASSES_KEY } from './os-integration.constants';

const openCommand = (exe: string): string => `"${exe}" "%1"`;

const protocolEntries = (product: OsIntegrationProduct, exe: string): RegistryValue[] =>
  product.protocols.flatMap(({ scheme, name }) => {
    const key = `${CLASSES_KEY}\\${scheme}`;
    return [
      { key, name: null, value: `URL:${name ?? product.name}` },
      { key, name: 'URL Protocol', value: '' },
      { key: `${key}\\DefaultIcon`, name: null, value: `"${exe}",0` },
      { key: `${key}\\shell\\open\\command`, name: null, value: openCommand(exe) },
    ];
  });

const fileEntries = (product: OsIntegrationProduct, exe: string, iconOf: FileIconOf): RegistryValue[] =>
  product.fileAssociations.flatMap(({ ext, name, progId, mimeType }) => {
    const extKey = `${CLASSES_KEY}\\.${ext.toLowerCase()}`;
    const progKey = `${CLASSES_KEY}\\${progId}`;
    return [
      { key: extKey, name: null, value: progId },
      ...(mimeType ? [{ key: extKey, name: 'Content Type', value: mimeType }] : []),
      { key: `${extKey}\\OpenWithProgids`, name: progId, value: '' },
      { key: progKey, name: null, value: name },
      { key: `${progKey}\\DefaultIcon`, name: null, value: iconOf(ext.toLowerCase()) },
      { key: `${progKey}\\shell\\open\\command`, name: null, value: openCommand(exe) },
    ];
  });

const windowsRegistryEntries = (product: OsIntegrationProduct, exe: string, iconOf: FileIconOf): RegistryValue[] =>
  [...protocolEntries(product, exe), ...fileEntries(product, exe, iconOf)];

export { windowsRegistryEntries };
