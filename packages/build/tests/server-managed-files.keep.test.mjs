/* @layer tooling-scripts @kind test */
import { afterEach, describe, expect, it } from 'vitest';
import { CONFIG, PRODUCT, cleanup, managedFiles, put, tempDir } from './server-packaging-fixture.mjs';

afterEach(cleanup);

const BARE = { product: PRODUCT, targets: ['server'] };

describe('K2 the managed server unit and Dockerfile', { tags: ['critical'] }, () => {
  const files = managedFiles();

  it('lists the unit, the Dockerfile and the two deb scripts', () => {
    expect(Object.keys(files)).toEqual(['build/server/fixture.service', 'build/server/Dockerfile', 'build/server/postinst', 'build/server/prerm']);
  });

  it('has no EXPOSE, no extra packages and no ports in the description when the app declares none', () => {
    const plain = managedFiles(BARE);
    expect(plain['build/server/Dockerfile']).not.toContain('EXPOSE');
    expect(plain['build/server/Dockerfile']).toContain('ca-certificates tini \\');
    expect(plain['build/server/fixture.service']).toContain('Description=Fixture App server\n');
  });
});

describe('K3 the managed deb scripts', { tags: ['critical'] }, () => {
  it('puts the app hook into postinst, before the service starts, without its shebang', () => {
    const root = tempDir();
    put(root, 'build/server/after-install.sh', '#!/bin/sh\r\ninstall-the-engine --quiet\r\n');
    const postinst = managedFiles(CONFIG, root)['build/server/postinst'];
    expect(postinst).toContain('\ninstall-the-engine --quiet\n');
    expect(postinst.indexOf('install-the-engine')).toBeLessThan(postinst.indexOf('systemctl daemon-reload'));
    expect(postinst.match(/#!/g)).toHaveLength(1);
  });
});
