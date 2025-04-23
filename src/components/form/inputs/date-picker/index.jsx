import React, { useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./date-picker.css";
import calenderIcon from "../../../../assets/icons/calender.svg";

const CommonDatePicker = ({
  label = "",
  value,
  onChange = () => {},
  onBlur = () => {},
  placeholder = "Select Date",
  id,
  minDate = new Date(),
  readOnly = false,
  error,
}) => {
  const datePickerRef = useRef();
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    setSelectedDate(value ? new Date(value) : null);
  }, [value]);

  const handleChange = (date) => {
    setSelectedDate(date);
    onChange({ target: { value: date, id } });
    onBlur({ target: { value: date, id } });
  };

  return (
    <div
      data-testid={id}
      className={`datePickerContainer relative w-full ${
        error ? "hasError" : ""
      }`}
    >
      {label && (
        <label
          htmlFor={id}
          className="datePickerLabel block text-base text-left pb-2 pt-4"
        >
          <span className="text-red-500">*</span> {label}
        </label>
      )}

      <div className="relative w-full">
        <DatePicker
          id={id}
          selected={selectedDate}
          onChange={handleChange}
          onBlur={onBlur}
          placeholderText={placeholder}
          minDate={minDate}
          calendarClassName="datePickerCalendar"
          className="datePickerInput pr-12"
          ref={datePickerRef}
          disabled={readOnly}
        />
        {/* Calendar Icon */}
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <img
            src={calenderIcon}
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.8}
            stroke="black"
            className="w-5 h-5"
          />
        </div>
      </div>

      {error && <p className="dateFieldError text-red-500">{error}</p>}
    </div>
  );
};

export default CommonDatePicker;
