import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { MonthYearPickerProps } from "../types/month-year-picker-types";

const MonthYearPicker: React.FC<MonthYearPickerProps> = ({ onMonthSelect, selectedMonth }) => {

  const handleDateChange = (date: Date | null) => {
    if (date) {
      const formattedDate = `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
      onMonthSelect(formattedDate);
    }
  };

  const selectedDate = selectedMonth
    ? new Date(parseInt(selectedMonth.split('/')[1]), parseInt(selectedMonth.split('/')[0]) - 1)
    : new Date();

  return (
    <div>
      <div>
        <DatePicker
          selected={selectedDate}
          onChange={handleDateChange}
          placeholderText="Select month"
          dateFormat="MM/yyyy"
          showMonthYearPicker
          className="px-4 py-2 border rounded-lg"
          isClearable
        />
      </div>
    </div>
  );
}

export default MonthYearPicker;
