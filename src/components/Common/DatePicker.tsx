import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface DatePickerProps {
  value: string;
  onChange: (date: string) => void;
  maxDate?: string;
  minDate?: string;
  placeholder?: string;
}

const DEFAULT_MAX_DATE = format(new Date(), 'yyyy-MM-dd');
const DEFAULT_MIN_DATE = '2020-01-01';

export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  maxDate = DEFAULT_MAX_DATE,
  minDate = DEFAULT_MIN_DATE,
  placeholder = 'Select date',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [month, setMonth] = useState(value ? new Date(value) : new Date());

  const handlePrevMonth = () => {
    setMonth(new Date(month.getFullYear(), month.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setMonth(new Date(month.getFullYear(), month.getMonth() + 1));
  };

  const handleDateClick = (day: number) => {
    const selectedDate = new Date(month.getFullYear(), month.getMonth(), day);
    const formattedDate = format(selectedDate, 'yyyy-MM-dd');
    onChange(formattedDate);
    setIsOpen(false);
  };

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const isDateInRange = (day: number): boolean => {
    const selectedDate = new Date(month.getFullYear(), month.getMonth(), day);
    const selectedStr = format(selectedDate, 'yyyy-MM-dd');
    return selectedStr >= minDate && selectedStr <= maxDate;
  };

  const daysInMonth = getDaysInMonth(month);
  const firstDay = getFirstDayOfMonth(month);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-300 hover:border-gray-400 transition-colors"
      >
        <Calendar className="w-5 h-5" />
        <span>{value || placeholder}</span>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg p-4 z-50 w-64">
          <div className="flex justify-between items-center mb-4">
            <button onClick={handlePrevMonth} className="p-1 hover:bg-gray-100 rounded">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="font-bold">{format(month, 'MMMM yyyy')}</span>
            <button onClick={handleNextMonth} className="p-1 hover:bg-gray-100 rounded">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-2 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-sm font-semibold text-gray-500">
                {day}
              </div>
            ))}
            {Array(firstDay)
              .fill(null)
              .map((_, i) => (
                <div key={`empty-${i}`} />
              ))}
            {days.map(day => (
              <button
                key={day}
                onClick={() => isDateInRange(day) && handleDateClick(day)}
                disabled={!isDateInRange(day)}
                className={`p-2 rounded text-sm ${
                  value === format(new Date(month.getFullYear(), month.getMonth(), day), 'yyyy-MM-dd')
                    ? 'bg-blue-500 text-white'
                    : isDateInRange(day)
                    ? 'hover:bg-gray-100 cursor-pointer'
                    : 'text-gray-300 cursor-not-allowed'
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DatePicker;
