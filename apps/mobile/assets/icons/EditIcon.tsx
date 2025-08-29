import { Svg, Path } from "react-native-svg";

export default function EditIcon({ height, width, fill }: { height: number, width: number, fill: string }) {
    return (
        <Svg stroke={fill} fill="none" strokeWidth="1.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height={height} width={width}><Path strokeWidth="1.5" d="M12 20h9"></Path><Path strokeWidth="1.5" d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></Path></Svg>
    )
}