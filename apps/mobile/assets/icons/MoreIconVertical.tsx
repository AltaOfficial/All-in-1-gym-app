import { Svg, Path } from "react-native-svg";

export default function MoreIconVertical({width, height, fill}: {width: number, height: number, fill: string}) {
  return (
    <Svg stroke={fill} fill={fill} stroke-width="0" viewBox="0 0 512 512" height={height} width={width}><Path d="M296 136c0-22.002-17.998-40-40-40s-40 17.998-40 40 17.998 40 40 40 40-17.998 40-40zm0 240c0-22.002-17.998-40-40-40s-40 17.998-40 40 17.998 40 40 40 40-17.998 40-40zm0-120c0-22.002-17.998-40-40-40s-40 17.998-40 40 17.998 40 40 40 40-17.998 40-40z"></Path></Svg>
  );
};