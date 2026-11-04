/* @layer core @kind logic */
const identities = new WeakMap<object, number>();
let nextIdentity = 1;

const placementIdentity = (placement: unknown): string => {
  if (typeof placement !== 'object' || placement === null) return String(placement);
  let id = identities.get(placement);
  if (id === undefined) {
    id = nextIdentity;
    nextIdentity += 1;
    identities.set(placement, id);
  }
  return `#${id}`;
};

export { placementIdentity };
