import React, { useRef } from "react";
import { Autocomplete } from "@react-google-maps/api";

// const libraries = ["places"];

const PlaceSearchInput = ({ onPlaceSelect, register, error }) => {
  const autocompleteRef = useRef(null);

  const handlePlaceChanged = () => {
    const place = autocompleteRef.current.getPlace();
    if (place && place.geometry) {
      const location = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
        name: place.formatted_address,
      };
      onPlaceSelect(location);
    }
  };

  return (
    <div>
      <label className="text-left block text-base font-medium pt-4 pb-2">
        <span className="text-red-500">* </span> Location
      </label>

      <Autocomplete
        onLoad={(ref) => (autocompleteRef.current = ref)}
        onPlaceChanged={handlePlaceChanged}
      >
        <input
          {...register("location")}
          placeholder="Type the location..."
          className="block w-full border border-[#C8C8C8] px-4 py-2"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault(); 
            }
          }}
        />
      </Autocomplete>

      <p className="text-red-500 text-sm">{error?.message}</p>
    </div>
  );
};

export default PlaceSearchInput;
