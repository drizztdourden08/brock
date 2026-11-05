/* @layer renderer-shell @kind constants */
const BUILDS_INDEX_PATH = 'archipelago/builds.json';

const BUILDS_INDEX_ATTEMPTS = 4;

const BUILDS_INDEX_RETRY_MS = 750;

const buildPathOf = (moduleName: string, apVersion: string): string => `archipelago/${apVersion}/${moduleName}.apworld`;

export { BUILDS_INDEX_ATTEMPTS, BUILDS_INDEX_PATH, BUILDS_INDEX_RETRY_MS, buildPathOf };
