import React, { useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./date-picker.css";
import calenderIcon from "../../../../assets/icons/b-calender.svg";

const CommonDatePicker = ({
  label = "",
  value,
  onChange = () => {},
  onBlur = () => {},
  placeholder = "Select Date",
  id,
  minDate = new Date(),
  readOnly = false,
  required = false,
  error,
}) => {
  console.log("🚀 ~ value:", value)
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
          <span className="text-red-500">{`${required ?"*" :""}`}</span> {label}
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
        <div className=" flex justify-center items-center absolute top-0 right-0 border-l border-black/10 h-full">
          <div className="items-center content-center p-4 items-center pointer-events-none">
            <img src={calenderIcon} alt="time" />
          </div>
        </div>
      </div>

      {error && <p className="dateFieldError text-red-500">{error}</p>}
    </div>
  );
};

export default CommonDatePicker;
