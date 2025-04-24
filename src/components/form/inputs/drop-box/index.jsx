import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { twMerge } from "tailwind-merge";
import uploadIcon from "../../../../assets/icons/upload-icon.svg";

const CustomDropzone = ({
  label,
  onChange,
  error,
  name,
  recommendedText = "Recommended size: 1152 × 600px | JPG, PNG (Max 10MB)",
  placeholder = "Browse or drag your file here",
}) => {
  const [fileName, setFileName] = useState("");
  const [preview, setPreview] = useState(null);

  const onDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        setPreview(URL.createObjectURL(file));
        setFileName(file.name);
        onChange(file);
      }
    },
    [onChange]
  );

  const removeImage = () => {
    setFileName("");
    setPreview(null);
    onChange({ target: { name, value: null } });
  };

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpg", ".jpeg", ".png"],
    },
    maxSize: 10 * 1024 * 1024,
    multiple: false,
  });

  return (
    <div className="w-full text-left">
      {label && (
        <label className="block text-base pb-2 pt-4">
          <span className="text-red-500">*</span> {label}
        </label>
      )}

      <div
        {...getRootProps()}
        className={twMerge(
          "relative flex flex-col items-center justify-center text-center border border-[#C8C8C8] h-[300px] text-sm cursor-pointer overflow-hidden"
        )}
      >
        <input {...getInputProps()} />
        {preview ? (
          <div
          className="w-full h-full bg-no-repeat bg-contain bg-center"
          style={{ backgroundImage: `url(${preview})` }}
          >
            <div className="absolute top-2 right-2 flex gap-2 z-10">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  open();
                }}
                className="text-white font-medium border border-white px-8 py-4"
              >
                Replace
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeImage();
                }}
                className="bg-[#D03A2A] font-medium text-white px-8 py-4"
              >
                Remove
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <img src={uploadIcon} alt="upload icon" />
            <p className="mb-2">{fileName || placeholder}</p>
            <p className="text-[#858585]">{recommendedText}</p>
          </div>
        )}
      </div>

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default CustomDropzone;
