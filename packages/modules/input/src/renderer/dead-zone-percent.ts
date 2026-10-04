/* @layer renderer-shell @kind logic */
const deadZonePercent = (value: number): string => `${Math.round(value * 100)}%`;

export { deadZonePercent };
