/* @layer tooling-scripts @kind logic */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fillTemplate } from '../../release/fill-template.mjs';
import { serverOptions } from './server-options.mjs';
import { PRIVILEGED_PORT_LIMIT, SERVER_DIR, SERVER_DOCKERFILE, SERVER_HOOK, SERVER_POSTINST, SERVER_PRERM } from './server.constants.mjs';

const oneLine = (text) => String(text).replace(/\s+/g, ' ').trim();

const appHook = (rootDir) => {
  const file = join(rootDir, SERVER_HOOK);
  if (!existsSync(file)) return '';
  const body = readFileSync(file, 'utf8').replace(/\r\n/g, '\n').replace(/^#!.*\n/, '').trim();
  return body ? `\n${body}\n` : '';
};

const portsText = (ports) => (ports.length ? ` (port${ports.length > 1 ? 's' : ''} ${ports.join(', ')})` : '');

const capabilitiesText = (ports) => (ports.some((port) => port < PRIVILEGED_PORT_LIMIT) ? '\nAmbientCapabilities=CAP_NET_BIND_SERVICE' : '');

const exposeText = (ports) => (ports.length ? `\nEXPOSE ${ports.join(' ')}` : '');

const packagesText = (names) => names.map((name) => ` ${name}`).join('');

/**
 * @param {import('../platform.type.mjs').PlatformContext} ctx
 * @returns {{ path: string, content: string }[]} the unit, the Dockerfile and the .deb scripts of the server
 */
const serverManagedFiles = ({ rootDir, config }) => {
  const options = serverOptions(config);
  const { id, name } = config.product;
  const values = { ID: id, NAME: oneLine(name), PORTS: portsText(options.ports), CAPABILITIES: capabilitiesText(options.ports) };
  return [
    { path: `build/server/${id}.service`, content: fillTemplate(SERVER_DIR, 'server.service.tmpl', values) },
    {
      path: SERVER_DOCKERFILE,
      content: fillTemplate(SERVER_DIR, 'Dockerfile.tmpl', { ID: id, PACKAGES: packagesText(options.osPackages), EXPOSE: exposeText(options.ports) }),
    },
    { path: SERVER_POSTINST, content: fillTemplate(SERVER_DIR, 'postinst.sh.tmpl', { ID: id, HOOK: appHook(rootDir) }) },
    { path: SERVER_PRERM, content: fillTemplate(SERVER_DIR, 'prerm.sh.tmpl', { ID: id }) },
  ];
};

export { serverManagedFiles };
