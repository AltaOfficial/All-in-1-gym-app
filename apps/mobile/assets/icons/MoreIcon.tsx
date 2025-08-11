import { Svg, Path } from "react-native-svg";

export default function MoreIcon({width, height, fill}: {width: number, height: number, fill: string}) {
  return (
    <Svg stroke={fill} fill={fill} stroke-width="0" viewBox="0 0 512 512" height={height} width={width}><Path d="M255.8 218c-21 0-38 17-38 38s17 38 38 38 38-17 38-38-17-38-38-38zM102 218c-21 0-38 17-38 38s17 38 38 38 38-17 38-38-17-38-38-38zM410 218c-21 0-38 17-38 38s17 38 38 38 38-17 38-38-17-38-38-38z"></Path></Svg>
  );
};