/* @layer renderer-shell @kind component */
import { useCallback, useState } from 'react';
import { Box, Button, Image, Text } from '@drizztdourden08/tessera/primitives';
import { writeClipboard } from '../../host/write-clipboard';
import { COPIED_MS } from './About.constants';
import type { AboutProps } from './About.type';
import './About.css';

const copyLabel = (copied: boolean, copyText: string | null): string => {
  if (copied) return 'Copied';
  return copyText === null ? 'Collecting...' : 'Copy debug info';
};

const About = (props: AboutProps) => {
  const { productName, logoSrc, rows, legalText, copyText } = props;
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    if (!copyText) return;
    if (await writeClipboard(copyText)) {
      setCopied(true);
      setTimeout(() => setCopied(false), COPIED_MS);
    }
  }, [copyText]);

  return (
    <Box className="about">
      <Box className="about__header">
        {logoSrc && <Image className="about__logo" src={logoSrc} alt="" />}
        <Text as="h2" className="about__title">{productName}</Text>
      </Box>

      <Box className="about__body">
        {rows.map((row) => (
          <Box key={row.label} className="about__row">
            <Text className="about__label">{row.label}</Text>
            <Text className="about__value">{row.value}</Text>
          </Box>
        ))}
      </Box>

      {copyText !== undefined && (
        <Button variant="secondary" className="about__copy" onClick={handleCopy} disabled={copyText === null}>
          {copyLabel(copied, copyText)}
        </Button>
      )}

      {legalText && <Text as="p" className="about__legal">{legalText}</Text>}
    </Box>
  );
};

export { About };
