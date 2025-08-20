import { Svg, Path, G } from 'react-native-svg'

export default function CheckmarkIcon ({ height, width, fill }: { height: number, width: number, fill: string }) {
  return (
    <Svg stroke={fill} fill={fill} stroke-width="0" viewBox="0 0 512 512" height={height} width={width}><Path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M416 128 192 384l-96-96"></Path></Svg>
  )
}