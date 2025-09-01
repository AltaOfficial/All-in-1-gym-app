import {Svg, Path} from 'react-native-svg'

export default function XIcon({ height, width, fill }: { height: number, width: number, fill: string }) {
  return (
    <Svg stroke={fill} fill={fill} stroke-width="0" viewBox="0 0 512 512" height={height} width={width}><Path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M368 368 144 144m224 0L144 368"></Path></Svg>
  )
}