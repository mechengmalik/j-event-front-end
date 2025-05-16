import React from "react";

const InputField = ({ 
  label, 
  name, 
  register, 
  required = false, 
  placeholder = "", 
  error = null,
  type = "text"
}) => {
  return (
    <div className="flex flex-col items-start w-full">
      <label className="text-left block text-base font-medium pt-4 pb-2">
        {required && <span className="text-red-500">* </span>} {label}
      </label>
      <input
        {...register(name)}
        type={type}
        className="block w-full border border-[#C8C8C8] px-4 py-4 text-sm rounded-lg"
        placeholder={placeholder}
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};

export default InputField;