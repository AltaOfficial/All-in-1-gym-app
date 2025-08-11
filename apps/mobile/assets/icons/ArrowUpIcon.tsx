import { Svg, Path } from 'react-native-svg'


export default function ArrowUpIcon({ height, width, fill }: { height: number, width: number, fill: string }) {
    return (
        <Svg stroke={fill} fill={fill} stroke-width="0" viewBox="0 0 384 512" height={height} width={width}><Path d="M214.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 141.2 160 448c0 17.7 14.3 32 32 32s32-14.3 32-32l0-306.7L329.4 246.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-160-160z"></Path></Svg>
    )
}