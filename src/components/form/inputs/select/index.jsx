import React from "react";
import Select from "react-select";
import { twMerge } from "tailwind-merge";
import "./select.css";

const CustomSelectInput = ({
  label,
  error,
  options,
  field,
  placeholder,
  isSearchable = false,
  isMulti = false,
}) => {
  return (
    <div className="flex flex-col items-start w-full">
      <label className="text-left block text-base pt-4 pb-2">
        <span className="text-red-500">*</span> {label}
      </label>

      <Select
        {...field}
        isMulti={isMulti}
        isSearchable={isSearchable}
        placeholder={placeholder}
        options={options}
        classNamePrefix="custom-select"
        classNames={{
          control: () =>
            twMerge(
              "w-full border text-sm py-3",
              error && "border-red-500 ring-red-200"
            ),
          menu: () => "z-10",
        }}
        styles={{
          control: (base) => ({
            ...base,
            minHeight: "56px",
            paddingLeft: "4px",
            cursor: "pointer",
          }),
          multiValue: (base) => ({
            ...base,
            backgroundColor: "#8354A3",
            padding: "2px 5px",
          }),
          multiValueLabel: (base) => ({
            ...base,
            color: "white",
          }),
          multiValueRemove: (base) => ({
            ...base,
            color: "white",
            cursor: "pointer",
            ":hover": {
              backgroundColor: "white",
              color: "#4C1D95",
            },
          }),
        }}
      />

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default CustomSelectInput;
