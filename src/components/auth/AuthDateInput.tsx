import React, { useState, useRef, useMemo, useCallback, memo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  Animated,
  Dimensions,
  FlatList,
} from 'react-native';
import { Calendar, ChevronDown } from 'lucide-react-native';

interface AuthDateInputProps {
  label: string;
  value: Date | null;
  onDateChange: (date: Date) => void;
  error?: string;
  minimumDate?: Date;
  maximumDate?: Date;
}

const { height: screenHeight } = Dimensions.get('window');

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

// Memoized Day Item Component
const DayItem = memo(({ day, isSelected, onPress }: any) => (
  <TouchableOpacity
    onPress={() => onPress(day)}
    activeOpacity={0.7}
    className={`py-2 px-3 m-1 rounded-lg ${
      isSelected ? 'bg-purple-500' : 'bg-white border border-gray-200'
    }`}
  >
    <Text
      className={`text-center font-semibold ${
        isSelected ? 'text-white' : 'text-gray-900'
      }`}
    >
      {String(day).padStart(2, '0')}
    </Text>
  </TouchableOpacity>
));

// Memoized Month Item Component
const MonthItem = memo(({ month, index, isSelected, onPress }: any) => (
  <TouchableOpacity
    onPress={() => onPress(index)}
    activeOpacity={0.7}
    className={`py-2 px-3 m-1 rounded-lg ${
      isSelected ? 'bg-purple-500' : 'bg-white border border-gray-200'
    }`}
  >
    <Text
      className={`text-center font-semibold text-xs ${
        isSelected ? 'text-white' : 'text-gray-900'
      }`}
    >
      {month.slice(0, 3)}
    </Text>
  </TouchableOpacity>
));

// Memoized Year Item Component
const YearItem = memo(({ year, isSelected, onPress }: any) => (
  <TouchableOpacity
    onPress={() => onPress(year)}
    activeOpacity={0.7}
    className={`py-2 px-3 m-1 rounded-lg ${
      isSelected ? 'bg-purple-500' : 'bg-white border border-gray-200'
    }`}
  >
    <Text
      className={`text-center font-semibold text-sm ${
        isSelected ? 'text-white' : 'text-gray-900'
      }`}
    >
      {year}
    </Text>
  </TouchableOpacity>
));

export default function AuthDateInput({
  label,
  value,
  onDateChange,
  error,
  minimumDate,
  maximumDate,
}: AuthDateInputProps) {
  const [showPicker, setShowPicker] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [selectedDay, setSelectedDay] = useState(value?.getDate() || 1);
  const [selectedMonth, setSelectedMonth] = useState(value?.getMonth() || 0);
  const [selectedYear, setSelectedYear] = useState(value?.getFullYear() || new Date().getFullYear());

  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Memoized years range - extends to 2100
  const years = useMemo(() => {
    const maxYear = maximumDate?.getFullYear() || 2100;
    const minYear = minimumDate?.getFullYear() || 1900;
    const yearsArray = [];
    for (let i = maxYear; i >= minYear; i--) {
      yearsArray.push(i);
    }
    return yearsArray;
  }, [minimumDate, maximumDate]);

  // Memoized days - only recalculates when month/year changes
  const days = useMemo(() => {
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => i + 1);
  }, [selectedMonth, selectedYear]);

  const formatDate = useCallback((date: Date | null) => {
    if (!date) return '';
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }, []);

  const handleDateChange = useCallback(() => {
    const newDate = new Date(selectedYear, selectedMonth, selectedDay);
    onDateChange(newDate);
    handleClose();
  }, [selectedYear, selectedMonth, selectedDay, onDateChange]);

  const handlePress = useCallback(() => {
    setShowPicker(true);
    setIsFocused(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const handleClose = useCallback(() => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      setShowPicker(false);
      setIsFocused(false);
    });
  }, [fadeAnim]);

  const handleDayPress = useCallback((day: number) => {
    setSelectedDay(day);
  }, []);

  const handleMonthPress = useCallback((month: number) => {
    setSelectedMonth(month);
  }, []);

  const handleYearPress = useCallback((year: number) => {
    setSelectedYear(year);
  }, []);

  // Render functions for FlatList (faster than map)
  const renderDayItem = useCallback(({ item }: any) => (
    <DayItem
      day={item}
      isSelected={selectedDay === item}
      onPress={handleDayPress}
    />
  ), [selectedDay, handleDayPress]);

  const renderMonthItem = useCallback(({ item, index }: any) => (
    <MonthItem
      month={item}
      index={index}
      isSelected={selectedMonth === index}
      onPress={handleMonthPress}
    />
  ), [selectedMonth, handleMonthPress]);

  const renderYearItem = useCallback(({ item }: any) => (
    <YearItem
      year={item}
      isSelected={selectedYear === item}
      onPress={handleYearPress}
    />
  ), [selectedYear, handleYearPress]);

  const keyExtractor = useCallback((item: any, index: number) => {
    if (typeof item === 'number' && item > 100) {
      return `year-${item}`;
    }
    return `item-${index}`;
  }, []);

  return (
    <View className="mb-4">
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.7}
        className={`flex-row items-center bg-white rounded-lg px-3 py-2 border-2 ${
          error ? 'border-red-500' : isFocused ? 'border-purple-500' : 'border-gray-300'
        }`}
      >
        <Calendar
          size={18}
          color={error ? '#ef4444' : isFocused ? '#a855f7' : '#9ca3af'}
          className="mr-2"
        />

        <View className="flex-1">
          <Text
            className={`text-base font-semibold px-1 mx-1 py-2 ${
              value ? 'text-gray-900' : 'text-gray-400'
            }`}
          >
            {value ? formatDate(value) : label}
          </Text>
        </View>

        <ChevronDown
          size={18}
          color={isFocused ? '#a855f7' : '#9ca3af'}
        />
      </TouchableOpacity>

      {error && (
        <Text className="text-red-500 text-xs mt-2 ml-3 font-medium">
          {error}
        </Text>
      )}

      <Modal
        transparent
        animationType="fade"
        visible={showPicker}
        onRequestClose={handleClose}
      >
        <Animated.View
          style={{ opacity: fadeAnim }}
          className="flex-1 bg-black/50 justify-end"
        >
          <View className="bg-white rounded-t-3xl max-h-96">
            {/* Header */}
            <View className="flex-row justify-between items-center px-6 py-4 border-b border-gray-200">
              <TouchableOpacity onPress={handleClose}>
                <Text className="text-gray-500 font-semibold text-base">Cancel</Text>
              </TouchableOpacity>
              <Text className="text-xl font-bold text-gray-900">Select Date</Text>
              <TouchableOpacity onPress={handleDateChange}>
                <Text className="text-purple-500 font-semibold text-base">Done</Text>
              </TouchableOpacity>
            </View>

            {/* Selected Date Preview */}
            <View className="bg-gradient-to-r from-purple-50 to-blue-50 px-6 py-3 border-b border-gray-100">
              <Text className="text-sm text-gray-600 font-medium">
                {MONTHS[selectedMonth]} {selectedDay}, {selectedYear}
              </Text>
            </View>

            {/* Picker Sections */}
            <View className="flex-row px-4 py-4 gap-2">
              {/* Day Picker */}
              <View className="flex-1">
                <Text className="text-xs font-semibold text-gray-500 mb-2 text-center uppercase tracking-wide">
                  Day
                </Text>
                <FlatList
                  data={days}
                  renderItem={renderDayItem}
                  keyExtractor={(item) => `day-${item}`}
                  scrollEnabled={true}
                  nestedScrollEnabled={true}
                  removeClippedSubviews={true}
                  initialNumToRender={10}
                  maxToRenderPerBatch={15}
                  updateCellsBatchingPeriod={50}
                  className="bg-gray-50 rounded-lg border border-gray-200"
                />
              </View>

              {/* Month Picker */}
              <View className="flex-1">
                <Text className="text-xs font-semibold text-gray-500 mb-2 text-center uppercase tracking-wide">
                  Month
                </Text>
                <FlatList
                  data={MONTHS}
                  renderItem={renderMonthItem}
                  keyExtractor={(_, index) => `month-${index}`}
                  scrollEnabled={true}
                  nestedScrollEnabled={true}
                  removeClippedSubviews={true}
                  className="bg-gray-50 rounded-lg border border-gray-200"
                />
              </View>

              {/* Year Picker */}
              <View className="flex-1">
                <Text className="text-xs font-semibold text-gray-500 mb-2 text-center uppercase tracking-wide">
                  Year
                </Text>
                <FlatList
                  data={years}
                  renderItem={renderYearItem}
                  keyExtractor={(item) => `year-${item}`}
                  scrollEnabled={true}
                  nestedScrollEnabled={true}
                  removeClippedSubviews={true}
                  initialNumToRender={15}
                  maxToRenderPerBatch={20}
                  updateCellsBatchingPeriod={50}
                  className="bg-gray-50 rounded-lg border border-gray-200"
                />
              </View>
            </View>
          </View>
        </Animated.View>
      </Modal>
    </View>
  );
}