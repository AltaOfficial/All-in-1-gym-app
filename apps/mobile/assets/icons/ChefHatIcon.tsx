import { Svg, Path } from "react-native-svg";

export default function ChefHatIcon({width, height, fill}: {width: number, height: number, fill: string}) {
  return (
    <Svg stroke={fill} fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height={height} width={width}><Path d="M17 21a1 1 0 0 0 1-1v-5.35c0-.457.316-.844.727-1.041a4 4 0 0 0-2.134-7.589 5 5 0 0 0-9.186 0 4 4 0 0 0-2.134 7.588c.411.198.727.585.727 1.041V20a1 1 0 0 0 1 1Z"></Path><Path d="M6 17h12"></Path></Svg>
  );
};