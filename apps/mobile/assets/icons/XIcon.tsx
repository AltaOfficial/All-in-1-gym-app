import { Svg, Path } from "react-native-svg";

export default function XIcon({
  height,
  width,
  fill,
}: {
  height: number;
  width: number;
  fill: string;
}) {
  return (
    <Svg
      stroke={fill}
      fill={fill}
      strokeWidth="0"
      viewBox="0 0 512 512"
      height={height}
      width={width}
    >
      <Path
        fill={fill}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="32"
        d="M368 368 144 144m224 0L144 368"
      ></Path>
    </Svg>
  );
}
