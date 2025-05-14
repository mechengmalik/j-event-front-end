import React, { useState, useEffect } from "react";
import ReactTimePicker from "react-time-picker";
import "react-time-picker/dist/TimePicker.css";
import calenderIcon from "../../../../assets/icons/b-calender.svg"
const TimePicker = ({
  label,
  value,
  onChange,
  onBlur,
  id,
  error,
  hourPlaceholder = "18",
  minutePlaceholder = "00",
}) => {
  const [timeValue, setTimeValue] = useState(value);

  useEffect(() => {
    if (value) {
      setTimeValue(value);
    }
  }, [value]);

  const handleTimeChange = (newTime) => {
    setTimeValue(newTime);
    onChange(newTime); // Pass directly
  };

  const handleTimeBlur = () => {
    onBlur(timeValue);
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
        <ReactTimePicker
          id={id}
          value={timeValue}
          onChange={handleTimeChange}
          onBlur={handleTimeBlur}
          format="HH:mm" // 24-hour format
          clockIcon={null} // Remove default icon if you want
          clearIcon={null}
          hourPlaceholder={hourPlaceholder}
          minutePlaceholder={minutePlaceholder}
          className="datePickerInput" //You can add a classname
          isOpen={false}
        />
        {/* Clock Icon - you may need to add this icon to your assets */}
        <div className=" flex justify-center items-center absolute top-0 right-0 border-l border-black/10 h-full">
          <div
            className="items-center content-center p-4 items-center pointer-events-none"
          >
            <img src={calenderIcon} alt="time" />
          </div>
        </div>
      </div>

      {error && <p className="dateFieldError text-red-500">{error}</p>}
    </div>
  );
};

export default TimePicker;
