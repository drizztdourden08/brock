/* @layer tooling-scripts @kind constants */
const SERVER_ACTIONS = Object.freeze({
  qemu: Object.freeze({ name: 'docker/setup-qemu-action', sha: '99012661954931238ded8c8b007157a8430204e1', version: 'v4.4.0' }),
  buildx: Object.freeze({ name: 'docker/setup-buildx-action', sha: 'f87e5991a6d7451dcb8d9637bfbc97413f497069', version: 'v4.4.1' }),
  login: Object.freeze({ name: 'docker/login-action', sha: 'dbcb813823bdd20940b903addbd779551569679f', version: 'v4.6.0' }),
  build: Object.freeze({ name: 'docker/build-push-action', sha: 'c3c9e263c25d99ce0380d002d59b67737d91b0dc', version: 'v7.4.0' }),
});
const SERVER_REGISTRY = 'ghcr.io';
const SERVER_DOCKER_ARTIFACT = 'server-docker';
const SERVER_JOBS = Object.freeze({ ci: 'server', release: 'build-server', image: 'publish-server-image' });

export { SERVER_ACTIONS, SERVER_REGISTRY, SERVER_DOCKER_ARTIFACT, SERVER_JOBS };
