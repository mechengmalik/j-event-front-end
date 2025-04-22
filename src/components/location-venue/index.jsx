import React from "react";
import { useLoadScript } from "@react-google-maps/api";

import PlaceSearchInput from "./search";
import MapDisplay from "./map-frame";

const libraries = ["places"];

const LocationForm = ({ register, error, onPlaceSelect, selectedLocation}) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyCS4Yf-ebBL6IKXB7AsF_Iw5d8bzHpdXO0",
    libraries,
  });

 


  if (!isLoaded) return <div>Loading Maps...</div>;

  return (
    <>
      <PlaceSearchInput
        onPlaceSelect={onPlaceSelect}
        register={register}
        error={error}
      />
      <MapDisplay location={selectedLocation} className="mt-4" />
    </>
  );
};

export default LocationForm;
