import { Text, View, Pressable } from 'react-native'
import { useState, useEffect } from 'react'

interface CalandarNavbarProps {
  onDateSelect?: (date: Date) => void;
  selectedDate?: Date;
}

const CalandarNavbar = ({ onDateSelect, selectedDate }: CalandarNavbarProps) => {
  const [currentWeek, setCurrentWeek] = useState<Date[]>([]);
  const [selected, setSelected] = useState<Date>(selectedDate || new Date());

  useEffect(() => {
    generateWeekDates();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      console.log(selectedDate)
      setSelected(selectedDate);
      generateWeekDates(selectedDate);
    }
  }, [selectedDate]);

  const generateWeekDates = (date: Date = new Date()) => {
    const day = date.getDay();
    // Calculate days to subtract to get to Monday (day 1)
    // Sunday is 0, Monday is 1, Tuesday is 2, etc.
    const daysToSubtract = day === 0 ? 6 : day - 1;
    
    // Create a new date object for the start of the week
    const startOfWeek = new Date(date.getFullYear(), date.getMonth(), date.getDate() - daysToSubtract);

    const weekDates: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const newDate = new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + i);
      weekDates.push(newDate);
    }
    setCurrentWeek(weekDates);
  };

  const handleDatePress = (date: Date) => {
    setSelected(date);
    onDateSelect?.(date);
  };

  const isSelected = (date: Date) => {
    return date.toDateString() === selected.toDateString();
  };

  const formatDay = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  const formatDate = (date: Date) => {
    return date.getDate().toString();
  };

  return (
    <View className="px-10 pb-4">
      <View className="flex-row justify-between">
        {currentWeek.map((date, index) => (
          <Pressable
            key={index}
            onPress={() => handleDatePress(date)}
            className="items-center"
          >
            <Text className="text-gray3 font-[HelveticaNeue]">
              {formatDay(date)}
            </Text>
            <View className={`w-10 h-10 bg-black/10 rounded-full items-center justify-center ${
              isSelected(date) ? 'bg-primary' : ''
            }`}>
              <Text className={`font-[HelveticaNeue] ${
                isSelected(date) ? 'text-white' : 'text-white'
              }`}>
                {formatDate(date)}
              </Text>
            </View>
          </Pressable>
        ))}
      </View>
    </View>
  )
}

export default CalandarNavbar;