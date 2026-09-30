/* @layer core @kind test */
import { describe, expect, it } from 'vitest';
import { redactSecrets } from '../src/log/redact-secrets';

describe('redactSecrets', () => {
  it('hides bearer and basic credentials', () => {
    expect(redactSecrets('Authorization: Bearer abc.def-123456')).toBe('Authorization: Bearer ***');
    expect(redactSecrets('auth header Basic dXNlcjpwYXNz')).toBe('auth header Basic ***');
  });

  it('hides key and value pairs in text, JSON and query strings', () => {
    expect(redactSecrets('password=hunter22 next')).toBe('password=*** next');
    expect(redactSecrets('{"api_key":"k-123","name":"x"}')).toBe('{"api_key":"***","name":"x"}');
    expect(redactSecrets('GET /cb?access_token=abc123&page=2')).toBe('GET /cb?access_token=***&page=2');
    expect(redactSecrets('client_secret: s3cr3t')).toBe('client_secret: ***');
  });

  it('hides credentials inside a URL', () => {
    expect(redactSecrets('clone https://me:pa55@github.com/o/r.git')).toBe('clone https://***:***@github.com/o/r.git');
  });

  it('hides known token shapes', () => {
    expect(redactSecrets(`push with ghp_${'a'.repeat(36)} now`)).toBe('push with *** now');
    expect(redactSecrets('jwt eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozjgNryP4J3jVmNHl0w5N')).toBe('jwt ***');
    expect(redactSecrets('key AKIAABCDEFGHIJKLMNOP here')).toBe('key *** here');
  });

  it('leaves ordinary lines alone', () => {
    const line = '12:00:01 INFO [app] Opened settings at https://example.com/docs';
    expect(redactSecrets(line)).toBe(line);
  });
});
