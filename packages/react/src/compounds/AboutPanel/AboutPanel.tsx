/* @layer renderer-shell @kind component */
import { BrandWordmark } from '@drizztdourden08/tessera/brand';
import { Box, Paragraph, StatRow, Text } from '@drizztdourden08/tessera/primitives';
import { AboutCopyButton } from './sub-components/AboutCopyButton';
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
        {rows.map((row) => <StatRow key={row.label} className="about-panel__row" label={row.label} value={row.value} mono />)}
      </Box>
      {copyText !== undefined && <AboutCopyButton text={copyText} label={copyLabel} />}
      {legal != null && <Paragraph tone="dim" className="about-panel__legal">{legal}</Paragraph>}
    </Box>
  );
};

export { AboutPanel };
