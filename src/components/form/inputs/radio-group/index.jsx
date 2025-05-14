import React from "react";
import RadioCard from "../radio-card";

const RadioCardGroup = ({ 
  label, 
  options, 
  value, 
  onChange, 
  required = false,
  error = null
}) => {
  return (
    <div className="flex flex-col items-start w-full">
      <label className="text-left block text-base font-medium pt-4 pb-2">
        {required && <span className="text-red-500">* </span>} {label}
      </label>
      <div className="flex gap-4 w-full">
        {options.map((option) => (
          <RadioCard
            key={option.value}
            value={option.value}
            checked={value === option.value}
            onChange={() => onChange(option.value)}
            title={option.title}
            description={option.description}
          />
        ))}
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};

export default RadioCardGroup;
