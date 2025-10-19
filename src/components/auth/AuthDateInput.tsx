import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import { Calendar, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react-native';

interface AuthDateInputProps {
  label: string;
  value: Date | null;
  onDateChange: (date: Date) => void;
  error?: string;
  minimumDate?: Date;
  maximumDate?: Date;
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export default function AuthDateInput({
  label,
  value,
  onDateChange,
  error,
  minimumDate,
  maximumDate,
}: AuthDateInputProps) {
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(value?.getMonth() || new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(value?.getFullYear() || new Date().getFullYear());
  const [tempSelectedDate, setTempSelectedDate] = useState<Date | null>(value);

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  const calendarDays = useMemo(() => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const days = [];

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  }, [currentMonth, currentYear]);

  const handleDayPress = (day: number) => {
    const newDate = new Date(currentYear, currentMonth, day);
    setTempSelectedDate(newDate);
  };

  const handleSetDate = () => {
    if (tempSelectedDate) {
      onDateChange(tempSelectedDate);
    }
    setShowCalendar(false);
  };

  const handleCancel = () => {
    setTempSelectedDate(value);
    setShowCalendar(false);
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const isSelected = (day: number) => {
    if (!tempSelectedDate) return false;
    return (
      tempSelectedDate.getDate() === day &&
      tempSelectedDate.getMonth() === currentMonth &&
      tempSelectedDate.getFullYear() === currentYear
    );
  };

  return (
    <View className="mb-4">
      <Text className="text-sm text-gray-600 mb-2 font-medium">{label}</Text>
      
      <TouchableOpacity
        onPress={() => setShowCalendar(true)}
        className={`flex-row items-center bg-white rounded-lg px-3 py-3 border ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
      >
        <Calendar size={18} color="#9ca3af" className="mr-2" />
        <Text className={`flex-1 text-base ${value ? 'text-gray-900' : 'text-gray-400'}`}>
          {value ? formatDate(value) : 'Select date'}
        </Text>
        <ChevronDown size={18} color="#9ca3af" />
      </TouchableOpacity>

      {error && (
        <Text className="text-red-500 text-xs mt-2 ml-1 font-medium">
          {error}
        </Text>
      )}

      <Modal
        transparent
        animationType="fade"
        visible={showCalendar}
        onRequestClose={() => setShowCalendar(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setShowCalendar(false)}
          className="flex-1 bg-black/50 justify-center items-center"
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl w-11/12 max-w-sm overflow-hidden"
          >
            {/* Header */}
            <View className="bg-purple-500 px-5 py-4">
              <View className="flex-row items-center justify-between">
                <TouchableOpacity onPress={handlePrevMonth} className="p-2">
                  <ChevronLeft size={24} color="#ffffff" />
                </TouchableOpacity>
                
                <Text className="text-white text-lg font-bold">
                  {MONTHS[currentMonth]} {currentYear}
                </Text>
                
                <TouchableOpacity onPress={handleNextMonth} className="p-2">
                  <ChevronRight size={24} color="#ffffff" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Calendar Grid */}
            <View className="p-4">
              {/* Day headers */}
              <View className="flex-row mb-2">
                {DAYS.map((day) => (
                  <View key={day} className="flex-1 items-center">
                    <Text className="text-gray-500 text-xs font-semibold">
                      {day}
                    </Text>
                  </View>
                ))}
              </View>

              {/* Calendar days */}
              <View className="flex-row flex-wrap">
                {calendarDays.map((day, index) => (
                  <View key={index} className="w-[14.28%] aspect-square p-0.5">
                    {day ? (
                      <TouchableOpacity
                        onPress={() => handleDayPress(day)}
                        activeOpacity={0.7}
                        className={`flex-1 items-center justify-center rounded-lg ${
                          isSelected(day)
                            ? 'bg-blue-500'
                            : 'bg-transparent'
                        }`}
                      >
                        <Text
                          className={`text-base font-medium ${
                            isSelected(day)
                              ? 'text-white'
                              : 'text-gray-900'
                          }`}
                        >
                          {day}
                        </Text>
                      </TouchableOpacity>
                    ) : (
                      <View className="flex-1" />
                    )}
                  </View>
                ))}
              </View>
            </View>

            {/* Footer */}
            <View className="border-t border-gray-200 px-4 py-3 flex-row justify-end gap-2">
              <TouchableOpacity
                onPress={handleCancel}
                className="px-6 py-2 rounded-lg"
              >
                <Text className="text-gray-600 font-semibold">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSetDate}
                className="px-6 py-2 bg-blue-500 rounded-lg"
              >
                <Text className="text-white font-semibold">Set</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}