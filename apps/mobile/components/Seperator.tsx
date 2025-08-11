import { View } from 'react-native'

export default function Seperator({ className }: { className?: string }) {
  return (
    <View className={`bg-white/50 h-[0.1px] w-full ${className}`}>
    </View>
  )
}