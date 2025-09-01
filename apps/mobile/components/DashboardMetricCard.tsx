import { Pressable, Text, View } from 'react-native'
import ChevronRightIcon from '../assets/icons/ChevronRightIcon'
import ArrowDownIcon from '../assets/icons/ArrowDownIcon'
import ArrowUpIcon from '../assets/icons/ArrowUpIcon'

type Props = {
  title: string
  value: string
  subLabel?: string
  dateFrom: string
  dateTo: string
  isPositive?: boolean
  isGood?: boolean
  onPress?: () => void
  className?: string
}

export default function DashboardMetricCard({ title, value, subLabel, dateFrom, dateTo, isPositive, isGood, className, onPress }: Props) {
  return (
    <Pressable className={`bg-gray1 rounded-xl p-4 mb-4 ${className}`} style={{ width: '48%' }} onPress={onPress} android_ripple={{ color: '#27272A' }}>
      <View>
        <Text className='text-white font-semibold'>{title}</Text>
        <Text className='text-white/60 text-xs mt-1'>{formatDateRange(dateFrom, dateTo)}</Text>
      </View>

      <View className='mt-6 flex-row items-center justify-between'>
          <View className='flex-row gap-1'>
            {isPositive ? <ArrowUpIcon height={10} width={10} fill={isGood === true ? '#00FF4D' : isGood === false ? '#F43A45' : 'white'} /> : isPositive === false ? <ArrowDownIcon height={10} width={10} fill={isGood === true ? '#00FF4D' : isGood === false ? '#F43A45' : 'white'} /> : null}
            <View className='flex-row gap-1 items-baseline'>
              <Text className='text-white text-xl font-bold'>{value}</Text>
              {subLabel ? <Text className='text-white/70 text-sm'>{subLabel}</Text> : null}
            </View>
          </View>
        <ChevronRightIcon height={18} width={18} fill='white' />
      </View>
    </Pressable>
  )
}

function formatDateRange(from: string, to: string): string {
  if (!from || !to) return ''
  // adding 00:00:00 to the date since sometimes .getDate() returns the day before and not the current day
  to = to + "T00:00:00"
  from = from + "T00:00:00"

  try {
    const f = new Date(from)
    const t = new Date(to)
    const today = new Date()
    
    const isToday = t.getDate() === today.getDate() && t.getMonth() === today.getMonth() && t.getFullYear() === today.getFullYear()
    
    const fStr = `${f.getDate()} ${f.toLocaleString('en-US', { month: 'short' })}`
    const tStr = isToday ? 'Today' : `${t.getDate()} ${t.toLocaleString('en-US', { month: 'short' })}`
    return `${fStr} - ${tStr}`
  } catch {
    return `${from} - ${to}`
  }
}