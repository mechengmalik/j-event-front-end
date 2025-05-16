import React, { useEffect } from "react";
import PlaceSearchInput from "./search";
import MapDisplay from "./map-frame";

const LocationForm = ({
  register,
  errors,
  setValue,
  watch,
  onPlaceSelect,
  selectedLocation,
  hight,
}) => {
  // Watch location values
  const locationAddress = watch("location") || "";
  const locationLat = watch("locationLat") || "";
  const locationLng = watch("locationLng") || "";

  // Debug log - remove in production
  useEffect(() => {
    console.log("Location Form Values:", {
      selectedLocation: selectedLocation?.address,
      locationLat: selectedLocation?.lat,
      locationLng: selectedLocation?.lng,
    });
  }, [locationAddress, locationLat, locationLng]);

  // Initialize from existing values
  useEffect(() => {
    if (locationAddress && locationLat && locationLng && !selectedLocation) {
      onPlaceSelect({
        address: selectedLocation?.address,
        lat: parseFloat(selectedLocation?.lat),
        lng: parseFloat(selectedLocation?.lng),
      });
    }
  }, [
    locationAddress,
    locationLat,
    locationLng,
    onPlaceSelect,
    selectedLocation,
  ]);

  const handlePlaceSelect = (location) => {
    console.log("Selected place:", location);
    onPlaceSelect(location);

    // IMPORTANT: These setValue calls are crucial!
    if (setValue) {
      setValue("location", location.address || "");
      setValue("locationLat", location.lat || "");
      setValue("locationLng", location.lng || "");

      // Force validation
      setValue("location", location.address || "", {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
    } else {
      console.error("setValue is not available in LocationForm!");
    }
  };

  return (
    <div className="space-y-6">
      {hight ? (
        <>
          {/* Map display first when 'hight' is true */}
            <MapDisplay location={selectedLocation} hight={hight} />
          <PlaceSearchInput
            required={false}
            onPlaceSelect={handlePlaceSelect}
            register={register}
            error={errors}
            removeAsterisk={hight} // Pass 'hight' prop to PlaceSearchInput
          />
        </>
      ) : (
        <>
          {/* Default order: PlaceSearchInput then MapDisplay */}
          <PlaceSearchInput
            required={true}
            onPlaceSelect={handlePlaceSelect}
            register={register}
            error={errors}
            removeAsterisk={hight} // Pass 'hight' prop to PlaceSearchInput
          />
          <div className="mt-4">
           
            <MapDisplay location={selectedLocation} hight={hight} />
          </div>
        </>
      )}

      {/* Hidden fields to store location data - with defaultValue to ensure they're registered */}
      <input
        type="hidden"
        {...register("locationLat")}
        defaultValue={locationLat}
      />
      <input
        type="hidden"
        {...register("locationLng")}
        defaultValue={locationLng}
      />
    </div>
  );
};

export default LocationForm;
