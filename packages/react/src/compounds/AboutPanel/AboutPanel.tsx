/* @layer renderer-shell @kind component */
import { BrandWordmark } from '@drizztdourden08/tessera/brand';
import { CopyButton } from '@drizztdourden08/tessera/composites';
import { Box, Paragraph, StatRow, Text } from '@drizztdourden08/tessera/primitives';
import { ABOUT_PANEL_TEXT } from './AboutPanel.constants';
import { AboutLogo } from './sub-components/AboutLogo';
import type { AboutPanelProps } from './AboutPanel.type';
import './AboutPanel.css';

const AboutPanel = (props: AboutPanelProps) => {
  const { title, brand, rim, heading = 'wordmark', logo, rows, copyText, copyLabel, legal, className = '' } = props;

  return (
    <Box className={`about-panel${className ? ` ${className}` : ''}`}>
      <Box className="about-panel__header">
        <AboutLogo brand={brand} rim={rim} logo={logo} />
        <Text as="h2" className="about-panel__title">
          {brand && heading === 'wordmark' ? <BrandWordmark app={brand} size="md" title={title} className="about-panel__wordmark" /> : title}
        </Text>
      </Box>
      <Box className="about-panel__rows">
        {rows.map((row) => <StatRow key={row.label} className="about-panel__row" label={row.label} value={row.value} mono size="sm" />)}
      </Box>
      {copyText !== undefined && (
        <CopyButton text={copyText ?? ''} label={copyLabel ?? ABOUT_PANEL_TEXT.copy} showLabel variant="secondary" size="md" loading={copyText === null} className="about-panel__copy" />
      )}
      {legal != null && <Paragraph tone="dim" className="about-panel__legal">{legal}</Paragraph>}
    </Box>
  );
};

export { AboutPanel };
