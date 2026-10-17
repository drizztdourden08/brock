/* @layer renderer-shell @kind component */
import { CopyButton } from '@drizztdourden08/tessera/composites';
import { Box, Paragraph, StatRow, Text } from '@drizztdourden08/tessera/primitives';
import { ABOUT_PANEL_TEXT } from './AboutPanel.constants';
import { AboutLogo } from './sub-components/AboutLogo';
import { AboutTitle } from './sub-components/AboutTitle';
import type { AboutPanelProps } from './AboutPanel.type';
import './AboutPanel.css';

const AboutPanel = (props: AboutPanelProps) => {
  const { title, brand, rim, heading = 'wordmark', wordmark, wordmarkRendering, logo, rows, copyText, copyLabel, legal, className = '' } = props;

  return (
    <Box className={`about-panel${wordmark ? ' about-panel--wordmark' : ''}${className ? ` ${className}` : ''}`}>
      <Box className="about-panel__header">
        <AboutLogo brand={brand} rim={rim} logo={logo} />
        <Text as="h2" className={wordmark ? 'about-panel__title about-panel__title--image' : 'about-panel__title'}>
          <AboutTitle title={title} brand={brand} heading={heading} wordmark={wordmark} wordmarkRendering={wordmarkRendering} />
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
