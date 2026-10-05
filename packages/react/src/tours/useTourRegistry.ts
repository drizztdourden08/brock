/* @layer renderer-shell @kind hook */
import { useEffect } from 'react';
import { getAppLog } from '../log/get-app-log';
import { uniqueTours } from './unique-tours';
import type { TourDef } from './tour.type';
import { useTourStore } from './useTourStore';

const warn = (message: string): void => getAppLog().log('app', message, 'warn');

const useTourRegistry = (appTours: readonly TourDef[], moduleTours: readonly TourDef[]): void => {
  useEffect(() => {
    useTourStore.getState().setTours(uniqueTours([...appTours, ...moduleTours], warn));
  }, [appTours, moduleTours]);
};

export { useTourRegistry };
