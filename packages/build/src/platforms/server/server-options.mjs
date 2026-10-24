/* @layer tooling-scripts @kind logic */
import {
  DEBIAN_PACKAGE_PATTERN, IMAGE_PATTERN, MAX_PORT, NODE_VERSION_PATTERN, SERVER_ARCHES, SERVER_DEFAULT_ARCHES, SERVER_LABEL, SERVER_NODE_VERSION,
} from './server.constants.mjs';

const fail = (field, message) => {
  throw new Error(`${SERVER_LABEL}.${field} ${message}`);
};

const listOf = (value, field) => {
  if (value === undefined) return [];
  if (!Array.isArray(value)) fail(field, 'is a list.');
  return value;
};

const archesOf = (value, field) => {
  const arches = value === undefined ? [...SERVER_DEFAULT_ARCHES] : listOf(value, field);
  if (!arches.length) fail(field, 'names at least one architecture.');
  const unknown = arches.find((arch) => !(arch in SERVER_ARCHES));
  if (unknown !== undefined) fail(field, `names "${unknown}"; the architectures are ${Object.keys(SERVER_ARCHES).join(' and ')}.`);
  return [...new Set(arches)];
};

const nodeOf = (value) => {
  if (value === undefined) return SERVER_NODE_VERSION;
  if (typeof value !== 'string' || !NODE_VERSION_PATTERN.test(value)) fail('node', 'is an exact Node version such as 24.11.0.');
  return value;
};

const packagesOf = (value) => {
  const names = listOf(value, 'osPackages');
  const bad = names.find((name) => typeof name !== 'string' || !DEBIAN_PACKAGE_PATTERN.test(name));
  if (bad !== undefined) fail('osPackages', `has "${bad}", which is not a Debian package name.`);
  return [...new Set(names)];
};

const portsOf = (value) => {
  const ports = listOf(value, 'ports');
  const bad = ports.find((port) => !Number.isInteger(port) || port < 1 || port > MAX_PORT);
  if (bad !== undefined) fail('ports', `has ${JSON.stringify(bad)}, which is not a port from 1 to ${MAX_PORT}.`);
  return [...new Set(ports)];
};

const imageOf = (value, product) => {
  if (value !== undefined) {
    if (typeof value !== 'string' || !IMAGE_PATTERN.test(value)) fail('image', 'is a lowercase image name without a tag, such as ghcr.io/owner/app-server.');
    return value;
  }
  return product.repo?.owner ? `ghcr.io/${product.repo.owner.toLowerCase()}/${product.id}-server` : null;
};

/**
 * @param {string} text the --arch value, a comma list
 * @returns {('x64' | 'arm64')[]} the architectures it names
 */
const archesFromFlag = (text) => archesOf(text.split(',').map((arch) => arch.trim()).filter(Boolean), 'arch (--arch)');

/**
 * @param {import('../../config.mjs').BrockConfig} config brock.config.ts
 * @returns {{ node: string, osPackages: string[], ports: number[], image: string | null, arch: ('x64' | 'arm64')[] }} the packaging options, checked, with their defaults
 */
const serverOptions = (config) => {
  const server = config.server ?? {};
  return {
    node: nodeOf(server.node),
    osPackages: packagesOf(server.osPackages),
    ports: portsOf(server.ports),
    image: imageOf(server.image, config.product),
    arch: archesOf(server.arch, 'arch'),
  };
};

export { archesFromFlag, serverOptions };
