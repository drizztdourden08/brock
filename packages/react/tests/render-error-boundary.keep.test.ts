/* @layer renderer-shell @kind test */
import { createElement } from 'react';
import type { ReactElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { ErrorBoundary } from '@drizztdourden08/tessera/composites';
import type { ErrorBoundaryProps } from '@drizztdourden08/tessera/composites';
import { RenderErrorBoundary } from '../src/errors/RenderErrorBoundary';
import { getAppLog } from '../src/log/get-app-log';

const caughtBy = (element: ReactElement<ErrorBoundaryProps>, error: Error): ErrorBoundary => {
  const boundary = new ErrorBoundary(element.props);
  boundary.state = ErrorBoundary.getDerivedStateFromError(error);
  boundary.componentDidCatch(error, { componentStack: '\n    at BrokenScreen (broken.tsx:3:9)\n    at ScreenHost' });
  return boundary;
};

describe('RenderErrorBoundary', () => {
  it('wraps the content in an error boundary that shows the child until something throws', () => {
    const element = RenderErrorBoundary({ scope: 'Screen rooms', children: 'Rooms' }) as ReactElement<ErrorBoundaryProps>;
    expect(element.type).toBe(ErrorBoundary);
    expect(new ErrorBoundary(element.props).render()).toBe('Rooms');
  });

  it('shows "This page hit an error" as a LoadError box with Retry and the error behind Details, then Reload page, Go home and Report a bug', () => {
    const onHome = vi.fn();
    const element = RenderErrorBoundary({ scope: 'Screen rooms', onHome, children: 'Rooms' }) as ReactElement<ErrorBoundaryProps>;
    const html = renderToStaticMarkup(createElement(() => caughtBy(element, new Error('boom')).render()));
    expect(html).toContain('This page hit an error');
    expect(html).toContain('boom');
    expect(html).toContain('load-error--box');
    expect(html).toContain('Details');
    for (const label of ['Retry', 'Reload page', 'Go home', 'Report a bug']) expect(html).toContain(label);
  });

  it('draws the part again on Retry, and logs it', () => {
    const element = RenderErrorBoundary({ scope: 'Screen rooms', children: 'Rooms' }) as ReactElement<ErrorBoundaryProps>;
    const boundary = caughtBy(element, new Error('boom'));
    boundary.setState = (next) => { boundary.state = { ...boundary.state, ...(next as object) }; };
    boundary.retry();
    expect(boundary.render()).toBe('Rooms');
    expect(getAppLog().getEntries().at(-1)).toMatchObject({ level: 'info', message: 'Screen rooms drawn again after its error' });
  });

  it('leaves Go home out when there is no home to go to, and names a widget in its label', () => {
    const element = RenderErrorBoundary({ scope: 'Widget logs', label: 'Logs hit an error', children: 'Logs' }) as ReactElement<ErrorBoundaryProps>;
    const html = renderToStaticMarkup(createElement(() => caughtBy(element, new Error('bad row')).render()));
    expect(html).toContain('Logs hit an error');
    expect(html).not.toContain('Go home');
  });

  it('logs the error with its scope and the component that threw to the log bus', () => {
    const element = RenderErrorBoundary({ scope: 'Screen rooms', children: 'Rooms' }) as ReactElement<ErrorBoundaryProps>;
    caughtBy(element, new Error('cannot read rooms'));
    const last = getAppLog().getEntries().at(-1);
    expect(last).toMatchObject({ level: 'error' });
    expect(last?.message).toBe('Screen rooms hit an error: cannot read rooms (at BrokenScreen (broken.tsx:3:9))');
  });
});
