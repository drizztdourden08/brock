/* @layer renderer-shell @kind logic */
import { defineHub } from '../../hub/define-hub';
import type { ModuleBucket } from '../../modules/renderer-module.type';
import type { ScreenDef } from '../screen.type';
import { bucketHub } from './bucket-hub';

const moduleBucketScreens = (buckets: readonly ModuleBucket[]): ScreenDef[] =>
  buckets.map(({ bucket, entries }) => defineHub(bucketHub(bucket, entries)));

export { moduleBucketScreens };
