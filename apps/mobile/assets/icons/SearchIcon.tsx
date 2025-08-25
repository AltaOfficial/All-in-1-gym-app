import { Svg, Path } from 'react-native-svg'

export default function SearchIcon({ height, width, fill }: { height: number, width: number, fill: string }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 512 512" fill={fill}>
      <Path fill="none" stroke={fill} strokeMiterlimit="10" strokeWidth="32" d="M221.09 64a157.09 157.09 0 1 0 157.09 157.09A157.1 157.1 0 0 0 221.09 64z"></Path>
      <Path fill="none" stroke={fill} strokeLinecap="round" strokeMiterlimit="10" strokeWidth="32" d="M338.29 338.29 448 448"></Path>
    </Svg>
  )
}