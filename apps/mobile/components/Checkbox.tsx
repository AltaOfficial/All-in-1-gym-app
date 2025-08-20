import { Pressable, View } from "react-native"
import { Circle, Path, Svg } from "react-native-svg"
import CheckmarkIcon from "../assets/icons/CheckmarkIcon"

export default function Checkbox({ className, checked, onPress }: { className?: string, checked: boolean, onPress?: () => void }) {

  return (
    <Pressable className={`flex-row items-center justify-center px-4 ${className}`} onPress={onPress}>
        <Svg width={23} height={23} viewBox="0 0 24 24">
            <Circle cx={12} cy={12} r={10} stroke={checked ? "#F43A45" : "white"} strokeWidth={2} fill={checked ? "#F43A45" : "transparent"} />
            {checked && <Path d="M7 12.5l3.5 3.5 6-6.5" stroke="white" strokeWidth={1.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />}
        </Svg>
    </Pressable>
  )
}
