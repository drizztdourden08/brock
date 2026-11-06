/* @layer core @kind logic */
import type { Region, World, WorldKeys } from '../../world/types';

const exitsText = <K extends WorldKeys>(region: Region<K>): string =>
  JSON.stringify(region.exits.map((exit) => `${exit.name} ${exit.source} ${exit.target}`).sort());

const eventsText = <K extends WorldKeys>(region: Region<K>): string =>
  JSON.stringify(region.events.map((event) => `${event.key} ${event.region}`).sort());

const regionDiff = <K extends WorldKeys>(id: K['region'], wide: Region<K> | undefined, profile: Region<K> | undefined): string[] => {
  if (wide === undefined || profile === undefined) return [`region ${id}`];
  const differ: string[] = [];
  if (exitsText(wide) !== exitsText(profile)) differ.push(`exits of ${id}`);
  if (eventsText(wide) !== eventsText(profile)) differ.push(`events of ${id}`);
  return differ;
};

const structureDiff = <K extends WorldKeys>(wide: World<K>, profile: World<K>): string[] => {
  const ids = new Set([...wide.regions.keys(), ...profile.regions.keys()]);
  const differ = [...ids].flatMap((id) => regionDiff(id, wide.regions.get(id), profile.regions.get(id)));
  return wide.start === profile.start ? differ : ['start', ...differ];
};

export { structureDiff };
