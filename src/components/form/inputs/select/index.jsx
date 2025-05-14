import React from "react";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
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
  allowCustomOption = false,
}) => {
  const SelectComponent = allowCustomOption ? CreatableSelect : Select;

  return (
    <div className="flex flex-col items-start w-full">
      <label className="text-left block text-base pt-4 pb-2">
        <span className="text-red-500">*</span> {label}
      </label>

      <SelectComponent
        {...field}
        isMulti={isMulti}
        isSearchable={isSearchable}
        placeholder={placeholder}
        options={options}
        onCreateOption={
          allowCustomOption
            ? (inputValue) => {
                const newOption = { label: inputValue, value: inputValue };
                const newValue = isMulti
                  ? [...(field.value || []), newOption]
                  : newOption;
                field.onChange(newValue);
              }
            : undefined
        }
        classNamePrefix="custom-select"
        classNames={{
          control: () =>
            twMerge(
              "w-full text-sm py-2",
              error && "border-red-500 ring-red-200"
            ),
          menu: () => "z-10",
        }}
        styles={{
          control: (base) => ({
            ...base,
            minHeight: "2rem",
            paddingLeft: "0.25rem",
            cursor: "pointer",
          }),
          multiValue: (base) => ({
            ...base,
            backgroundColor: "#8354A3",
            minHeight: "2rem",
            alignItems: "center",
          }),
          multiValueLabel: (base) => ({
            ...base,
            color: "white",
            padding: ".25rem 1rem",
            paddingLeft: "1rem",
          }),
          multiValueRemove: (base) => ({
            ...base,
            color: "white",
            cursor: "pointer",
            minHeight: "2rem",
            minWidth: "2rem",
            justifyContent: "center",
            ":hover": {
              backgroundColor: "#D03A2A",
              color: "white",
            },
          }),
          indicatorSeparator: (base) => ({
            ...base,
            display: "none",
          }),
          dropdownIndicator: (base, state) => ({
            ...base,
            color: "black", 
            padding: "8px", 
            transition: "all .2s ease",
            transform: state.isFocused ? "rotate(180deg)" : null,
          }),
        }}
      />

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default CustomSelectInput;
