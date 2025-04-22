import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { twMerge } from "tailwind-merge";
import uploadIcon from "../../../../assets/icons/upload-icon.svg";
import trashIcon from "../../../../assets/icons/trash.svg";

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
        onChange(file)// <-- this is key
      }
    },
    [onChange]
  );

  const removeImage = () => {
    setFileName("");
    setPreview(null);
    onChange({ target: { name, value: null } });
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpg", ".jpeg", ".png"],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    disabled: !!preview, // disable if image already uploaded
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
          "relative flex flex-col items-center text-center border border-[#C8C8C8] p-52 text-center text-sm cursor-pointer overflow-hidden"
        )}
      >
        <input {...getInputProps()} />
        {preview ? (
          <img
            src={preview}
            alt="Uploaded"
            className="absolute inset-0 w-full h-full"
          />
        ) : (
          <>
            <div>
              <img src={uploadIcon} alt="upload img" />
            </div>
            <div className="py-2 text-sm text-[#858585]">
              <p className="mb-2">{fileName || placeholder}</p>
              <p className="">{recommendedText}</p>
            </div>
          </>
        )}
      </div>

      {preview && (
        <button
          type="button"
          onClick={removeImage}
          className="my-4 flex justify-center text-sm w-full"
        >
          <span className="flex items-center gap-2 text-black/80">
            <img src={trashIcon} alt="trash icon" />
            Remove Banner
          </span>
        </button>
      )}

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default CustomDropzone;
