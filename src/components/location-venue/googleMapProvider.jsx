import React from "react";
import { LoadScript } from "@react-google-maps/api";

const libraries = ["places"];

// This component can be used to wrap any components that need Google Maps functionality
const GoogleMapsProvider = ({ children }) => {
  return (
    <LoadScript
      googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ""}
      libraries={libraries}
      loadingElement={<div className="p-4 text-gray-500">Loading Google Maps...</div>}
    >
      {children}
    </LoadScript>
  );
};

export default GoogleMapsProvider;