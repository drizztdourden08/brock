/* @layer core @kind constants */
const NET_HOST = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z][a-z0-9-]{0,61}[a-z0-9]$/;

const NET_TYPE = /^[a-z0-9][a-z0-9.+-]*\/(?:\*|[a-z0-9][a-z0-9.+-]*)$/;

const NET_DEFAULT_TYPES: readonly string[] = ['application/json', 'text/plain', 'image/png'];

const NET_DEFAULT_BYTES = 4 * 1024 * 1024;

const NET_MAX_BYTES = 32 * 1024 * 1024;

export { NET_DEFAULT_BYTES, NET_DEFAULT_TYPES, NET_HOST, NET_MAX_BYTES, NET_TYPE };
