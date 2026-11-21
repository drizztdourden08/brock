/* @layer renderer-shell @kind types */
import type { Text } from '@drizztdourden08/brock-core/i18n';

interface AboutScreenOptions {
  legalText?: Text;
}

interface AboutScreenBodyProps extends AboutScreenOptions {
  onClose: () => void;
}

export type { AboutScreenBodyProps, AboutScreenOptions };
