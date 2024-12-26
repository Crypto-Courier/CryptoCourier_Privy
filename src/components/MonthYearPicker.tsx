import React, { KeyboardEvent } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { MonthYearPickerProps } from "../types/month-year-picker-types";
import "../styles/DatePicker.css";

const MonthYearPicker: React.FC<MonthYearPickerProps> = ({
  onMonthSelect,
  selectedMonth,
}) => {
  const handleDateChange = (date: Date | null) => {
    if (date) {
      const formattedDate = `${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}/${date.getFullYear()}`;
      onMonthSelect(formattedDate);
    } else {
      onMonthSelect("");
    }
  };

  const handleKeyDown: any = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Delete") {
      handleDateChange(null);
      // Prevent the default backspace behavior
      event.preventDefault();
    }
  };

  const selectedDate = selectedMonth
    ? new Date(
        parseInt(selectedMonth.split("/")[1]),
        parseInt(selectedMonth.split("/")[0]) - 1
      )
    : null;

  return (
    <div className="z-[100]">
      <DatePicker
        selected={selectedDate}
        onChange={handleDateChange}
        onKeyDown={handleKeyDown}
        placeholderText="Select month"
        dateFormat="MM/yyyy"
        showMonthYearPicker
        isClearable={true}
        calendarClassName="custom-calendar"
        className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-black text-white focus:outline-none focus:ring-2 focus:ring-[#FFE500] focus:border-transparent"
      />
    </div>
  );
};

export default MonthYearPicker;
