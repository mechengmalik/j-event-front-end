import React from "react";
import RadioCard from "../radio-card";

const RadioCardGroup = ({ 
  label, 
  options, 
  value, 
  onChange, 
  required = false,
  error = null,
  row = true
}) => {
  return (
    <div className={`flex flex-col items-start w-full pt-4 ${!row && " pt-8 "}`}>
      <label className={`text-left block text-base font-normal pb-2 ${!row && " text-[#8354A3] font-medium  pb-4"}`}>
        {required && <span className="text-red-500">* </span>} {label}
      </label>
      <div className={`flex gap-4 w-full ${!row && "flex-col"}`} >
        {options.map((option) => (
          <RadioCard
            key={option.value}
            value={option.value}
            checked={value === option.value}
            onChange={() => onChange(option.value)}
            title={option.title}
            description={option.description}
            row = {row}
          />
        ))}
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};

export default RadioCardGroup;
