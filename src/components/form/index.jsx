// components/form/FormBuilder.jsx
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import InputField from "./inputs/input-field";
import TextareaField from "./inputs/text-area";
import RadioCardGroup from "./inputs/radio-group";
import CommonDatePicker from "./inputs/date-picker";
import CustomDropzone from "./inputs/drop-box";
import CustomSelectInput from "./inputs/select";
import LocationForm from "../location-venue";
import TimePicker from "./inputs/time-picker";
import GoogleMapProvider from "../location-venue/googleMapProvider";

const FormBuilder = ({
  formConfig,
  onSubmit,
  onCancel,
  submitButtonText = "Submit",
  cancelButtonText = "Cancel",
  setValue: formSetValue,
  defaultValues = {},
  setSelectedLocation,
  selectedLocation,
  hight,
  showButton = true,
}) => {
  // Create a dynamic schema based on form configuration
  const generateSchema = () => {
    const schemaObj = {};

    // Function to process a field and generate its validation
    const processField = (field) => {
      // If this is a layout row, process each of its fields
      if (field.layout === "row") {
        field.fields.forEach((subField) => {
          const validation = createValidation(subField);
          if (validation) {
            schemaObj[subField.name] = validation;
          }
        });
        return;
      }

      // Handle normal fields
      const validation = createValidation(field);
      if (validation) {
        schemaObj[field.name] = validation;
      }
    };

    // Function to create validation for a field
    const createValidation = (field) => {
      let validation;

      // Set the base validation type based on field type
      switch (field.type) {
        case "number":
          validation = yup.number().typeError("Please enter a valid number");
          break;
        case "date":
          validation = yup.date();
          break;
        case "time":
          validation = yup.string();
          break;
        case "file":
          validation = yup.mixed();
          break;
        case "select":
          validation = field.isMulti ? yup.array() : yup.object();
          break;
        default:
          validation = yup.string();
      }

      // Add specific validations based on field type
      if (field.type === "email") {
        validation = validation.email(`Please enter a valid email`);
      }

      if (field.type === "url") {
        validation = validation.url(`Please enter a valid URL`);
      }

      if (field.type === "select" && field.isMulti) {
        validation = validation
          .min(1, `Select at least one ${field.label}`)
          .required(field.errorMessage || `${field.label} are required`);
      }

      // Special case for endDate to validate against startDate
      if (field.name === "endDate") {
        validation = validation.min(
          yup.ref("startDate"),
          "End date must be after start date"
        );
      }
      // Special case for endDate to validate against startDate
      if (field.name === "endDate") {
        validation = validation.min(
          yup.ref("startDate"),
          "End date must be after start date"
        );
      }
      if (field.type === "time") {
        const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
        validation = validation.test(
          "time-format",
          "Please enter a valid time in 24-hour format (HH:MM)",
          (value) => !value || timeRegex.test(value)
        );

        if (field.name === "endTime" && field.type === "time") {
          validation = validation
            .test(
              "time-format",
              "Please enter a valid time in 24-hour format (HH:MM)",
              (value) =>
                !value || /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(value)
            )
            .test(
              "is-after-start-time",
              "End time must be after start time when dates are the same",
              function (endTimeStr) {
                const { startTime, startDate, endDate } = this.parent;

                // If no start time or dates, skip validation
                if (!startTime || !endTimeStr || !startDate || !endDate) {
                  return true;
                }

                // Convert dates to string format for comparison
                const startDateStr =
                  startDate instanceof Date
                    ? startDate.toISOString().split("T")[0]
                    : new Date(startDate).toISOString().split("T")[0];

                const endDateStr =
                  endDate instanceof Date
                    ? endDate.toISOString().split("T")[0]
                    : new Date(endDate).toISOString().split("T")[0];

                // If dates are different, no need to validate times
                if (startDateStr !== endDateStr) {
                  return true;
                }

                // If dates are the same, ensure end time is after start time
                const getHoursAndMinutes = (timeValue) => {
                  if (
                    typeof timeValue === "string" &&
                    timeValue.includes(":")
                  ) {
                    const [hours, minutes] = timeValue.split(":").map(Number);
                    return { hours, minutes };
                  } else if (timeValue instanceof Date) {
                    return {
                      hours: timeValue.getHours(),
                      minutes: timeValue.getMinutes(),
                    };
                  }
                  return { hours: -1, minutes: -1 }; // Indicate invalid time
                };

                const startTimeParts = getHoursAndMinutes(startTime);
                const endTimeParts = getHoursAndMinutes(endTimeStr); // Use endTimeStr here

                // Check for invalid time values
                if (startTimeParts.hours === -1 || endTimeParts.hours === -1) {
                  return true; // Skip validation if time format is invalid
                }

                if (endTimeParts.hours > startTimeParts.hours) {
                  return true;
                }

                if (
                  endTimeParts.hours === startTimeParts.hours &&
                  endTimeParts.minutes > startTimeParts.minutes
                ) {
                  return true;
                }

                return false;
              }
            );
        }
      }

      // Add required validation if the field is required
      if (field.required) {
        validation = validation.required(
          field.errorMessage || `${field.label} is required`
        );
      }

      // Add conditional validation if specified
      if (field.conditional) {
        return validation.when(field.conditional.field, {
          is: (val) => {
            if (Array.isArray(field.conditional.value)) {
              return field.conditional.value.includes(val);
            }
            return val === field.conditional.value;
          },
          then: (schema) => schema,
          otherwise: (schema) => schema.notRequired(),
        });
      }

      return validation;
    };

    // Process all fields in the form
    formConfig.fields.forEach(processField);

    return yup.object().shape(schemaObj);
  };

  const schema = generateSchema();

  const {
    register,
    handleSubmit,
    control,
    watch,
    trigger,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues,
  });

  // Function to render different types of form fields
  const renderField = (field) => {
    // For row layouts, return a row container with the fields inside
    if (field.layout === "row") {
      // Filter out any conditional fields that shouldn't be shown
      const visibleFields = field.fields.filter((subField) => {
        if (!subField.conditional) return true;

        const watchedValue = watch(subField.conditional.field);
        if (Array.isArray(subField.conditional.value)) {
          return subField.conditional.value.includes(watchedValue);
        }
        return watchedValue === subField.conditional.value;
      });

      if (visibleFields.length === 0) return null;

      return (
        <div
          key={field.name || `row-${Math.random()}`}
          className="flex gap-4 w-full"
        >
          {visibleFields.map((subField) => {
            // Calculate width for each sub-field
            // Default to equal widths if not specified
            const width = subField.width || `${100 / visibleFields.length}%`;
            const widthClass =
              typeof width === "string" && width.includes("/")
                ? `w-${width}` // For Tailwind fractions like "w-1/2"
                : { width }; // For percentage strings or custom widths

            return (
              <div
                key={subField.name}
                style={typeof widthClass === "object" ? widthClass : {}}
                className={typeof widthClass === "string" ? widthClass : ""}
              >
                {renderSingleField(subField)}
              </div>
            );
          })}
        </div>
      );
    }

    return renderSingleField(field);
  };

  // Function to render a single field (not a row)
  const renderSingleField = (field) => {
    // Check if field should be rendered based on conditions
    if (field.conditional) {
      const watchedValue = watch(field.conditional.field);
      if (Array.isArray(field.conditional.value)) {
        if (!field.conditional.value.includes(watchedValue)) {
          return null;
        }
      } else if (watchedValue !== field.conditional.value) {
        return null;
      }
    }

    switch (field.type) {
      case "text":
      case "email":
      case "url":
      case "number":
        return (
          <InputField
            key={field.name}
            label={field.label}
            name={field.name}
            placeholder={field.placeholder}
            register={register}
            required={field.required}
            error={errors[field.name]?.message}
            type={field.type}
          />
        );

      case "textarea":
        return (
          <TextareaField
            key={field.name}
            label={field.label}
            name={field.name}
            placeholder={field.placeholder}
            register={register}
            required={field.required}
            error={errors[field.name]?.message}
            rows={field.rows}
          />
        );

      case "select":
        return (
          <div
            key={field.name}
            className="flex flex-col items-start w-full text-left"
          >
            <Controller
              name={field.name}
              control={control}
              render={({ field: controllerField }) => (
                <CustomSelectInput
                  isMulti={field.isMulti}
                  isSearchable={field.isSearchable}
                  placeholder={field.placeholder}
                  label={field.label}
                  options={field.options}
                  field={controllerField}
                  error={errors[field.name]?.message}
                  allowCustomOption={field.allowCustomOption}
                  required={field.required}
                />
              )}
            />
          </div>
        );

      case "radio-group":
        return (
          <div key={field.name} className="flex flex-col items-start">
            <Controller
              name={field.name}
              control={control}
              rules={{
                required: field.required
                  ? field.errorMessage || `${field.label} is required`
                  : false,
              }}
              render={({ field: controllerField }) => (
                <RadioCardGroup
                  label={field.label}
                  options={field.options}
                  value={controllerField.value}
                  onChange={controllerField.onChange}
                  required={field.required}
                />
              )}
            />
            <p className="text-red-500 text-sm">
              {errors[field.name]?.message}
            </p>
          </div>
        );

      case "date":
        return (
          <div key={field.name} className="mb-4 w-full">
            <Controller
              control={control}
              name={field.name}
              render={({ field: controllerField }) => (
                <CommonDatePicker
                  label={field.label}
                  value={controllerField.value}
                  onChange={(date) => {
                    controllerField.onChange(date);
                    // Trigger validation for related date fields
                    if (field.name === "startDate") {
                      trigger("endDate");
                    }
                  }}
                  onBlur={controllerField.onBlur}
                  placeholder={field.placeholder}
                  id={field.name}
                  error={errors[field.name]?.message}
                  minDate={
                    field.minDateField
                      ? watch(field.minDateField) || new Date()
                      : undefined
                  }
                  required={field.required}
                />
              )}
            />
          </div>
        );
      case "time":
        return (
          <div key={field.name} className="mb-4 w-full">
            <Controller
              control={control}
              name={field.name}
              render={({ field: controllerField }) => (
                <TimePicker
                  label={field.label}
                  value={controllerField.value}
                  onChange={(value) => {
                    controllerField.onChange(value);
                    // Trigger validation for related time fields
                    if (field.name === "startTime") {
                      trigger("endTime");
                    }
                  }}
                  onBlur={controllerField.onBlur}
                  placeholder={field.placeholder}
                  id={field.name}
                  error={errors[field.name]?.message}
                  required={field.required}
                />
              )}
            />
          </div>
        );

      case "file":
        return (
          <div key={field.name}>
            <Controller
              control={control}
              name={field.name}
              render={({ field: controllerField, fieldState }) => (
                <CustomDropzone
                  label={field.label}
                  name={controllerField.name}
                  onChange={controllerField.onChange}
                  error={fieldState.error?.message}
                  required={field.required}
                />
              )}
            />
          </div>
        );

      case "custom-location":
        return (
          <GoogleMapProvider key={field.id}>
            <LocationForm
              register={register}
              error={errors.location}
              onPlaceSelect={setSelectedLocation}
              selectedLocation={selectedLocation}
              setValue={formSetValue} // for location lat and lng
              watch={watch}
              hight={hight}
            />
          </GoogleMapProvider>
        );

      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit((data) => onSubmit({ ...data }))}>
      {" "}
      <div className="space-y-4">
        {formConfig.fields.map((field) => {
          if (field.layout === "row") {
            return (
              <div key={field.name} className="flex gap-4 w-full">
                {field.fields.map((subField) => (
                  <div
                    key={subField.name}
                    className={`w-${field.width || "1/2"}`}
                  >
                    {renderField(subField)}
                  </div>
                ))}
              </div>
            );
          }
          return renderField(field);
        })}
      </div>
      {showButton && (
        <div className="flex justify-between gap-6 pt-8">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="border border-[#C8C8C8] w-1/2 px-6 py-2 bg-white hover:bg-gray-100"
            >
              {cancelButtonText}
            </button>
          )}
          <button
            type="submit"
            className="bg-[#8354A3] text-white w-1/2 px-6 py-2"
          >
            {submitButtonText}
          </button>
        </div>
      )}
    </form>
  );
};

export default FormBuilder;
