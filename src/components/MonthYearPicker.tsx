import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function MonthYearPicker() {
  const [startDate, setStartDate] = useState<Date>(new Date());

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setStartDate(date);
    }
  };

  return (
    <div>
      <div>
        <DatePicker
          selected={startDate}
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
