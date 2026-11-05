/* @layer electron-main @kind logic */
import type { LanSighting } from '../../archipelago/lobby';
import { browseMdns } from './browse-mdns';
import type { LanDiscovery, MdnsFactory } from './lan.type';
import { listenBeacons } from './listen-beacons';

const createLanDiscovery = (report: (sighting: LanSighting) => void, mdns?: MdnsFactory): LanDiscovery => {
  let stops: (() => void)[] = [];

  const stop = (): void => {
    for (const close of stops) close();
    stops = [];
  };

  const start: LanDiscovery['start'] = (settings) => {
    stop();
    stops = [listenBeacons(settings.beaconPort, report)];
    if (mdns !== undefined) stops.push(browseMdns(mdns, settings, report));
  };

  return { start, stop };
};

export { createLanDiscovery };
