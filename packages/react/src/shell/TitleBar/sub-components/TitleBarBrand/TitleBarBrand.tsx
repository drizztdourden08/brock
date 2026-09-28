/* @layer renderer-shell @kind component */
import { Box, Image, Text } from '@drizztdourden08/tessera/primitives';
import { InstanceBadge } from '../InstanceBadge';
import type { TitleBarBrandProps } from './TitleBarBrand.type';

const TitleBarBrand = (props: TitleBarBrandProps) => {
  const { productName, instanceName, logoSrc, instanceLogoSrc } = props;
  const logo = instanceName && instanceLogoSrc ? instanceLogoSrc : logoSrc;
  return (
    <Box className="titlebar__center">
      {logo && <Image className="titlebar__logo" src={logo} alt="" />}
      <Text className="titlebar__title">{productName}</Text>
      {instanceName && <InstanceBadge name={instanceName} />}
      {logo && <Image className="titlebar__logo" src={logo} alt="" />}
    </Box>
  );
};

export { TitleBarBrand };
