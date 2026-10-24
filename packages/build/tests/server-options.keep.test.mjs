/* @layer tooling-scripts @kind test */
import { describe, expect, it } from 'vitest';
import { archesFromFlag, serverOptions } from '../src/platforms/server/server-options.mjs';
import { SERVER_NODE_VERSION } from '../src/platforms/server/server.constants.mjs';
import { PRODUCT } from './server-packaging-fixture.mjs';

describe('the server options', () => {
  it('defaults to the pinned Node, x64 and an image from the repo owner', () => {
    expect(serverOptions({ product: PRODUCT })).toEqual({ node: SERVER_NODE_VERSION, osPackages: [], ports: [], image: 'ghcr.io/owner/fixture-server', arch: ['x64'] });
    expect(serverOptions({ product: { ...PRODUCT, repo: undefined } }).image).toBeNull();
  });

  it('takes node, osPackages, ports, image and arch from brock.config.ts', () => {
    const server = { node: '24.9.0', osPackages: ['bubblewrap'], ports: [8080], image: 'registry.example/team/app', arch: ['x64', 'arm64'] };
    expect(serverOptions({ product: PRODUCT, server })).toEqual({ ...server });
  });

  it('refuses values that would write a broken unit, Dockerfile or control file', () => {
    const problem = (server) => () => serverOptions({ product: PRODUCT, server });
    expect(problem({ node: 'v24' })).toThrow('server.node is an exact Node version');
    expect(problem({ osPackages: ['ok', 'bad name; rm -rf'] })).toThrow('server.osPackages has "bad name; rm -rf"');
    expect(problem({ ports: [70000] })).toThrow('server.ports has 70000');
    expect(problem({ image: 'Not Lowercase' })).toThrow('server.image is a lowercase image name');
    expect(problem({ arch: ['riscv'] })).toThrow('names "riscv"');
    expect(problem({ arch: [] })).toThrow('at least one architecture');
  });

  it('reads --arch as a comma list', () => {
    expect(archesFromFlag('x64,arm64')).toEqual(['x64', 'arm64']);
    expect(archesFromFlag('arm64')).toEqual(['arm64']);
    expect(() => archesFromFlag('')).toThrow('at least one architecture');
    expect(() => archesFromFlag('amd64')).toThrow('names "amd64"');
  });
});
