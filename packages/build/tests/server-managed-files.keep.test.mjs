/* @layer tooling-scripts @kind test */
import { afterEach, describe, expect, it } from 'vitest';
import { CONFIG, PRODUCT, cleanup, managedFiles, put, tempDir } from './server-packaging-fixture.mjs';

afterEach(cleanup);

const BARE = { product: PRODUCT, targets: ['server'] };

describe('the managed server unit and Dockerfile', () => {
  const files = managedFiles();

  it('lists the unit, the Dockerfile and the two deb scripts', () => {
    expect(Object.keys(files)).toEqual(['build/server/fixture.service', 'build/server/Dockerfile', 'build/server/postinst', 'build/server/prerm']);
  });

  it('renders the systemd unit', () => {
    expect(files['build/server/fixture.service']).toBe([
      '# @layer tooling-scripts @kind build',
      '# Managed by brock sync: the systemd unit the .deb installs.',
      '[Unit]',
      'Description=Fixture App server (ports 38290, 38291)',
      'Wants=network-online.target',
      'After=network-online.target',
      '',
      '[Service]',
      'Type=simple',
      'User=fixture',
      'Group=fixture',
      'StateDirectory=fixture',
      'ExecStart=/opt/fixture/bin/fixture-server',
      'Restart=on-failure',
      'RestartSec=5',
      'ProtectSystem=full',
      'PrivateTmp=yes',
      '',
      '[Install]',
      'WantedBy=multi-user.target',
      '',
    ].join('\n'));
  });

  it('renders the Dockerfile: trixie-slim, a non-root user, one volume, the ports, the health check and the OS packages', () => {
    const lines = files['build/server/Dockerfile'].split('\n');
    expect(lines).toContain('FROM debian:trixie-slim');
    expect(lines).toContain('ARG TARGETARCH');
    expect(lines).toContain(' && apt-get install -y --no-install-recommends ca-certificates tini bubblewrap libssl3 \\');
    expect(lines.some((line) => line.includes('useradd --system --uid 10001') && line.includes('fixture'))).toBe(true);
    expect(lines).toContain('ADD bundle-${TARGETARCH}.tar.gz /opt/');
    expect(lines).toContain('ENV BROCK_DATA_DIR=/data');
    expect(lines.filter((line) => line.startsWith('VOLUME'))).toEqual(['VOLUME /data']);
    expect(lines).toContain('USER 10001:10001');
    expect(lines).toContain('EXPOSE 38290 38291');
    expect(lines).toContain('HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 CMD ["/opt/fixture/bin/fixture-server", "health"]');
    expect(lines).toContain('ENTRYPOINT ["tini", "--", "/opt/fixture/bin/fixture-server"]');
  });

  it('has no EXPOSE, no extra packages and no ports in the description when the app declares none', () => {
    const plain = managedFiles(BARE);
    expect(plain['build/server/Dockerfile']).not.toContain('EXPOSE');
    expect(plain['build/server/Dockerfile']).toContain('ca-certificates tini \\');
    expect(plain['build/server/fixture.service']).toContain('Description=Fixture App server\n');
  });
});

describe('the managed deb scripts', () => {
  it('renders postinst and prerm with the system user and the service', () => {
    const files = managedFiles();
    const postinst = files['build/server/postinst'];
    expect(postinst.startsWith('#!/bin/sh\n')).toBe(true);
    expect(postinst).toContain('useradd --system --user-group --home-dir /var/lib/fixture --no-create-home --shell /usr/sbin/nologin fixture');
    expect(postinst).toContain('systemctl enable fixture.service');
    expect(postinst).toContain('systemctl restart fixture.service');
    expect(postinst).not.toContain('__');
    const prerm = files['build/server/prerm'];
    expect(prerm.startsWith('#!/bin/sh\n')).toBe(true);
    expect(prerm).toContain('systemctl disable --now fixture.service || true');
    expect(prerm).toContain('systemctl stop fixture.service || true');
  });

  it('puts the app hook into postinst, before the service starts, without its shebang', () => {
    const root = tempDir();
    put(root, 'build/server/after-install.sh', '#!/bin/sh\r\ninstall-the-engine --quiet\r\n');
    const postinst = managedFiles(CONFIG, root)['build/server/postinst'];
    expect(postinst).toContain('\ninstall-the-engine --quiet\n');
    expect(postinst.indexOf('install-the-engine')).toBeLessThan(postinst.indexOf('systemctl restart'));
    expect(postinst.match(/#!/g)).toHaveLength(1);
  });
});
