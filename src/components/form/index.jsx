// components/event/CreateEventForm.jsx
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import RadioCard from "./inputs/radio-card";
import CustomSelectInput from "./inputs/select";
import CommonDatePicker from "./inputs/date-picker";
import CustomDropzone from "./inputs/drop-box";
import LocationForm from "../location-venue";

const schema = yup.object().shape({
  eventName: yup.string().required("Event name is required"),
  description: yup.string().required("Description is required"),
  locationType: yup.string().required("Location type is required"),
  category: yup.object().required("Category is required"),
  keywords: yup
    .array()
    .min(1, "Select at least one keyword")
    .required("Keywords are required"),
  startDate: yup.date().required("Start date is required"),
  endDate: yup
    .date()
    .min(yup.ref("startDate"), "End date must be after start date")
    .required("End date is required"),
  banner: yup.mixed().required("Event banner is required"),
  location: yup.string().when("locationType", {
    is: (val) => val === "in-person" || val === "hybrid",
    then: (schema) => schema.required("Location is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
});

const locationTypes = [
  {
    value: "in-person",
    title: "In-person",
    description:
      "Conduct an event in a physical venue for face-to-face networking.",
  },
  {
    value: "virtual",
    title: "Virtual",
    description:
      "Host a digital event that engages participants who join remotely.",
  },
  {
    value: "hybrid",
    title: "Hybrid",
    description: "Expand your in-person event to reach a wider audience.",
  },
];

const categories = [
  { value: "conference", label: "Conference" },
  { value: "workshop", label: "Workshop" },
  { value: "meetup", label: "Meetup" },
];

function CreateEventForm({ onSubmit, defaultValues = {} }) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });
  console.log(errors);

  const [selectedLocation, setSelectedLocation] = useState(null);

  const locationType = watch("locationType");

  return (
    <>
      <form
        onSubmit={handleSubmit((data) =>
          onSubmit({ ...data, location: selectedLocation })
        )}
        className=""
      >
        {/* Event Name */}
        <div className="flex flex-col items-start">
          <label className=" text-left block text-base font-medium pt-4 pb-2">
            <span className="text-red-500">* </span> Event Name
          </label>
          <input
            {...register("eventName")}
            className="block w-full border border-[#C8C8C8]  px-4 py-4 text-sm"
            placeholder="Type the event name..."
          />
          <p className="text-red-500 text-sm">{errors.eventName?.message}</p>
        </div>

        {/* Description */}
        <div className="flex flex-col items-start">
          <label className=" text-left block text-base font-medium pt-4 pb-2">
            <span className="text-red-500">* </span> Description
          </label>
          <textarea
            {...register("description")}
            className="block w-full border border-[#C8C8C8] px-4 py-4 h-[204px] text-sm"
            placeholder="Type the event description"
          />
          <p className="text-red-500 text-sm">{errors.description?.message}</p>
        </div>

        {/* Location Type */}
        <div className="flex flex-col items-start">
          <Controller
            name="locationType"
            control={control}
            rules={{ required: "Event location type is required" }}
            render={({ field }) => (
              <div className="flex flex-col items-start w-full">
                <label className=" text-left block text-base font-medium pt-4 pb-2">
                  <span className="text-red-500">* </span> Event Location Type
                </label>
                <div className="flex gap-4 w-full">
                  {locationTypes.map((type) => (
                    <RadioCard
                      key={type.value}
                      value={type.value}
                      checked={field.value === type.value}
                      onChange={() => field.onChange(type.value)}
                      title={type.title}
                      description={type.description}
                    />
                  ))}
                </div>
              </div>
            )}
          />

          <p className="text-red-500 text-sm">{errors.locationType?.message}</p>
        </div>

        {/* Category */}
        <div className="flex flex-col items-start w-full text-left">
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <CustomSelectInput
                placeholder="Select Category"
                label="Category"
                options={categories}
                field={field}
                error={errors.category?.message}
              />
            )}
          />
        </div>

        {/* Keywords */}
        <div className="flex flex-col items-start w-full text-left">
          <Controller
            name="keywords"
            control={control}
            render={({ field }) => (
              <CustomSelectInput
                isSearchable={true}
                isMulti={true}
                placeholder="Choose Keywords"
                label="Keywords"
                options={categories}
                field={field}
                error={errors.category?.message}
              />
            )}
          />
        </div>

        {/* Dates */}
        <div className="flex gap-4 w-full">
          {/* Start Date */}
          <div className="mb-4 w-1/2">
            <Controller
              control={control}
              name="startDate"
              render={({ field }) => (
                <CommonDatePicker
                  label="Start Date"
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  placeholder="Select start date"
                  id="startDate"
                  error={errors.startDate?.message}
                />
              )}
            />
          </div>

          {/* End Date */}
          <div className="mb-4 w-1/2">
            <Controller
              control={control}
              name="endDate"
              render={({ field }) => (
                <CommonDatePicker
                  label="End Date"
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  placeholder="Select end date"
                  id="endDate"
                  error={errors.endDate?.message}
                />
              )}
            />
          </div>
        </div>

        {/* Banner */}
        <div>
          <Controller
            control={control}
            name="banner"
            render={({ field, fieldState }) => (
              <CustomDropzone
                label="Event Banner"
                name={field.name}
                onChange={field.onChange}
                error={fieldState.error?.message}
              />
            )}
          />
        </div>

        {(locationType === "in-person" || locationType === "hybrid") && (
          <LocationForm
            register={register}
            error={errors.location}
            onPlaceSelect={setSelectedLocation}
            selectedLocation={selectedLocation}
          />
        )}

        <div className="flex justify-between gap-6 pt-8">
          <button
            type="button"
            className="border border-[#C8C8C8] w-1/2 px-6 py-2 bg-white  hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-[#8354A3] text-white w-1/2 px-6 py-2 "
          >
            Create
          </button>
        </div>
      </form>
    </>
  );
}

export default CreateEventForm;
