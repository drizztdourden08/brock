/* @layer core @kind test */
import { describe, expect, it, vi } from 'vitest';
import { createSerialQueue } from '../src/serial-queue';
import { createToolRegistry } from '../src/create-tool-registry';
import { defineMcpTool } from '../src/define-mcp-tool';

const tool = (name: string) => defineMcpTool({ name, description: 'A test tool.', run: () => 'done' });

describe('K3 the tool registry', { tags: ['critical'] }, () => {
  it('registers, lists and unregisters, telling the listeners each time', () => {
    const registry = createToolRegistry();
    const changed = vi.fn();
    registry.onChange(changed);
    const off = registry.register(tool('first_tool'));
    expect(registry.list().map((info) => info.name)).toEqual(['first_tool']);
    expect(registry.get('first_tool')?.name).toBe('first_tool');
    off();
    off();
    expect(registry.list()).toEqual([]);
    expect(changed).toHaveBeenCalledTimes(2);
  });

  it('throws on a clash, a reserved name and a bad name', () => {
    const registry = createToolRegistry(['screenshot']);
    registry.register(tool('first_tool'));
    expect(() => registry.register(tool('first_tool'))).toThrow('already registered');
    expect(() => registry.register(tool('screenshot'))).toThrow('already registered');
    expect(() => registry.register({ name: 'Bad Name', description: 'x', run: () => 'x' })).toThrow('must match');
  });

  it('keeps a newer tool when an old unregister runs late', () => {
    const registry = createToolRegistry();
    const off = registry.register(tool('swap_tool'));
    off();
    registry.register(tool('swap_tool'));
    off();
    expect(registry.get('swap_tool')).toBeDefined();
  });

  it('stops telling a listener that unsubscribed', () => {
    const registry = createToolRegistry();
    const changed = vi.fn();
    registry.onChange(changed)();
    registry.register(tool('quiet_tool'));
    expect(changed).not.toHaveBeenCalled();
  });
});

describe('K3 the serial queue', { tags: ['critical'] }, () => {
  it('runs jobs one at a time in order, even after a failure', async () => {
    const queue = createSerialQueue();
    const order: string[] = [];
    const slow = queue.run(async () => {
      await new Promise((resolve) => setTimeout(resolve, 10));
      order.push('slow');
    });
    const broken = queue.run(() => Promise.reject(new Error('boom')));
    const last = queue.run(() => {
      order.push('last');
      return Promise.resolve(7);
    });
    expect(queue.pending()).toBe(3);
    await slow;
    await expect(broken).rejects.toThrow('boom');
    expect(await last).toBe(7);
    expect(order).toEqual(['slow', 'last']);
    expect(queue.pending()).toBe(0);
  });
});
