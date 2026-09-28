/* @layer renderer-shell @kind component */
import { useCallback, useState } from 'react';
import { Box, Button, Image, Text } from '@drizztdourden08/tessera/primitives';
import { COPIED_MS } from './About.constants';
import type { AboutProps } from './About.type';
import './About.css';

const writeClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
};

const About = (props: AboutProps) => {
  const { productName, version, logoSrc, rows, legalText, copyText } = props;
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
        <Text className="about__version">{version}</Text>
      </Box>

      <Box className="about__body">
        {rows.map((row) => (
          <Box key={row.label} className="about__row">
            <Text className="about__label">{row.label}</Text>
            <Text className="about__value">{row.value}</Text>
          </Box>
        ))}
      </Box>

      {copyText && (
        <Button variant="secondary" className="about__copy" onClick={handleCopy}>
          {copied ? 'Copied' : 'Copy details'}
        </Button>
      )}

      {legalText && <Text as="p" className="about__legal">{legalText}</Text>}
    </Box>
  );
};

export { About };
