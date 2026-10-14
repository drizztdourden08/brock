/* @layer tooling-scripts @kind test */
import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { tempTree } from './temp-tree.mjs';
import { androidPlatform } from '../src/platforms/android/android.platform.mjs';
import { backEdgeActivity } from '../src/platforms/android/back-edge-activity.mjs';
import { BACK_EDGE_EVENT } from '../src/platforms/android/android.constants.mjs';

const { tempDir, put, cleanup } = tempTree('brock-back-edge-');

afterEach(cleanup);

const ACTIVITY = 'mobile/android/app/src/main/java/com/example/my_app/MainActivity.java';
const MANIFEST = 'mobile/android/app/src/main/AndroidManifest.xml';
const DEFAULT_ACTIVITY = 'package com.example.my_app;\r\n\r\nimport com.getcapacitor.BridgeActivity;\r\n\r\npublic class MainActivity extends BridgeActivity {}\r\n';
const ctxOf = (rootDir) => ({ rootDir, config: { product: { appId: 'com.example.my-app' } }, modules: [] });

describe('the back gesture edge on Android', () => {
  it('rewrites the default MainActivity to dispatch the edge, opts into predictive back, then leaves it alone', async () => {
    const root = tempDir();
    put(root, ACTIVITY, DEFAULT_ACTIVITY);
    put(root, MANIFEST, '<manifest>\n    <application\n        android:label="My App">\n    </application>\n</manifest>\n');
    const step = backEdgeActivity();
    expect(await step.run(ctxOf(root))).toEqual({ status: 'done', detail: ACTIVITY });
    const java = readFileSync(join(root, ACTIVITY), 'utf8');
    expect(java).toContain('package com.example.my_app;');
    expect(java).toContain(`new CustomEvent('${BACK_EDGE_EVENT}', { detail: '" + edge + "' })`);
    expect(java).toContain('BackEventCompat.EDGE_RIGHT');
    expect(readFileSync(join(root, MANIFEST), 'utf8')).toContain('<application\n        android:enableOnBackInvokedCallback="true"\n        android:label="My App">');
    expect(await step.run(ctxOf(root))).toMatchObject({ status: 'skipped' });
  });

  it('waits for cap add android and leaves an activity with code of its own to the app', async () => {
    const root = tempDir();
    expect(await backEdgeActivity().run(ctxOf(root))).toMatchObject({ status: 'pending' });
    put(root, ACTIVITY, 'package com.example.my_app;\nimport com.getcapacitor.BridgeActivity;\npublic class MainActivity extends BridgeActivity { void own() {} }\n');
    expect(await backEdgeActivity().run(ctxOf(root))).toMatchObject({ status: 'failed', detail: expect.stringContaining(BACK_EDGE_EVENT) });
  });

  it('runs in the Android scaffold and names the event the Capacitor host listens for', () => {
    expect(androidPlatform.scaffold.map((step) => step.name)).toContain(backEdgeActivity().name);
    const host = readFileSync(resolve(import.meta.dirname, '../../react/src/platform/hosts/capacitor/capacitor.constants.ts'), 'utf8');
    expect(host).toContain(`const BACK_EDGE_EVENT = '${BACK_EDGE_EVENT}';`);
  });
});
