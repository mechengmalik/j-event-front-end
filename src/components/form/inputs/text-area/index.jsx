import React from 'react'

const TextareaField = ({ 
  label, 
  name, 
  register, 
  required = false, 
  placeholder = "", 
  error = null,
  rows = 6
}) => {
  return (
    <div className="flex flex-col items-start w-full">
      <label className="text-left block text-base font-medium pt-4 pb-2">
        {required && <span className="text-red-500">* </span>} {label}
      </label>
      <textarea
        {...register(name)}
        className="block w-full border border-[#C8C8C8] rounded-lg px-4 py-4 h-[204px] text-sm"
        placeholder={placeholder}
        rows={rows}
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};

export default TextareaField;
