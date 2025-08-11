import React from 'react'
import Svg, { Path, Polyline } from 'react-native-svg'

export default function HomeIcon({width, height, fill}: {width: number, height: number, fill: string}) {
  return (
<Svg stroke={fill} fill="none" stroke-width="0" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height={height} width={width}><Path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></Path><Polyline points="9 22 9 12 15 12 15 22"></Polyline></Svg>
  )
}