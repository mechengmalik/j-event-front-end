import React, { useRef, useState } from "react";
import { Autocomplete } from "@react-google-maps/api";

// const libraries = ["places"];

const PlaceSearchInput = ({ onPlaceSelect, register, error, required }) => {
  const autocompleteRef = useRef(null);

  const onLoad = (autocompleteInstance) => {
    setAutocomplete(autocompleteInstance);
  };

  const [autocomplete, setAutocomplete] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();

      console.log("Place selected:", place);

      // Check if we have complete place details with geometry
      if (place && place.geometry && place.geometry.location) {
        // Extract the data we need
        const locationData = {
          address: place.formatted_address || place.name || inputValue,
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
          placeId: place.place_id || "",
          name: place.name || "",
        };

        console.log("Extracted location data:", locationData);

        // Send the data back to parent component
        onPlaceSelect(locationData);
      } else {
        console.error(
          "No geometry information available for this place:",
          place
        );
      }
    } else {
      console.error("Autocomplete is not loaded yet!");
    }
  };

  return (
    <div>
      <label className={`text-left block text-base font-medium ${required &&("pb-2 pt-4")}`}>
        <span className="text-red-500">{required &&("*")}</span> Location
      </label>

      <Autocomplete
        onLoad={onLoad}
        onPlaceChanged={onPlaceChanged}
        options={{
          types: ["establishment", "geocode"],
          fields: ["place_id", "formatted_address", "geometry", "name"],
        }}
      >
        <input
          {...register("location")}
          placeholder="Type the location..."
          className="block w-full border border-[#C8C8C8] rounded-lg px-4 py-4"
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
