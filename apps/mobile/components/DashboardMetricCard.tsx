import { Text, View } from 'react-native'
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
}

export default function DashboardMetricCard({ title, value, subLabel, dateFrom, dateTo, isPositive }: Props) {
  return (
    <View className='bg-gray1 rounded-xl p-4 mb-4' style={{ width: '48%' }}>
      <View>
        <Text className='text-white font-semibold'>{title}</Text>
        <Text className='text-white/60 text-xs mt-1'>{formatDateRange(dateFrom, dateTo)}</Text>
      </View>

      <View className='mt-6 flex-row items-center justify-between'>
        <View className='flex-row gap-1'>
          {isPositive ? <ArrowUpIcon height={5} width={5} fill='white' /> : <ArrowDownIcon height={10} width={10} fill='white' />}
          <Text className='text-white text-xl font-bold'>{value}</Text>
          {subLabel ? <Text className='text-white/70 text-xs'>{subLabel}</Text> : null}
        </View>
        <ChevronRightIcon height={18} width={18} fill='white' />
      </View>
    </View>
  )
}

function formatDateRange(from: string, to: string): string {
  if (!from || !to) return ''
  try {
    const f = new Date(from)
    const t = new Date(to)
    const opts: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short' }
    const fStr = `${f.getDate()} ${f.toLocaleString('en-US', { month: 'short' })}`
    const tStr = `${t.getDate()} ${t.toLocaleString('en-US', { month: 'short' })}`
    return `${fStr} - ${tStr}`
  } catch {
    return `${from} - ${to}`
  }
}