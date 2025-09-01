import {Svg, Path, Circle} from 'react-native-svg'

export default function CameraIcon({ height, width, fill }: { height: number, width: number, fill: string }) {
  return (
    <Svg stroke={fill} fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height={height} width={width}><Path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></Path><Circle cx="12" cy="13" r="3"></Circle></Svg>
  )
}