/* @layer core @kind logic */
import type { HelperNode } from '../../world';

const callKey = (node: HelperNode): string => `${node.name}${JSON.stringify(node.args ?? [])}`;

export { callKey };
