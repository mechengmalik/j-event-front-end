import React from "react";
import { twMerge } from "tailwind-merge";

const RadioCard = ({ value, checked, onChange, title, description, row }) => {
  const labelClassName = twMerge(
    "cursor-pointer border p-4 rounded-lg w-full transition-colors duration-300",
    checked ? "border-[#8354A3] bg-purple-50" : "border-[#C8C8C8]",
    !row &&
      "flex items-center font-normal text-base space-x-2 py-2 border-none bg-white p-0"
  );


  return (
    <label className={labelClassName}>
      <input
        type="radio"
        value={value}
        checked={checked}
        onChange={onChange}
        className="hidden"
      />

      {/* Title + Circle */}
      <div className="flex items-center gap-3 ">
        {/* Radio circle */}
        <div className="relative flex items-center justify-center">
          <div
            className={twMerge(
              "w-5 h-5 rounded-full border-2 flex items-center justify-center",
              checked ? "border-[#8354A3]" : "border-[#C8C8C8]"
            )}
          >
            {checked && (
              <div className="w-2.5 h-2.5 bg-[#8354A3] rounded-full" />
            )}
          </div>
        </div>

        {!row ? (
          <h4 className={twMerge("text-base font-normal")}>{title}</h4>
        ) : (
          <h4
            className={twMerge(
              "text-base font-normal",
              checked ? "text-[#8354A3]" : "text-black"
            )}
          >
            {title}
          </h4>
        )}
      </div>

      {/* Description */}
      <p className="text-[#333333] mt-2 text-left text-sm">{description}</p>
    </label>
  );
};

export default RadioCard;
