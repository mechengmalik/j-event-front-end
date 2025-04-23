import React from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";

const mapContainerStyle = {
  width: "100%",
  height: "300px",
};

const defaultCenter = {
  lat: 31.963158, // Default to Amman
  lng: 35.930359,
};

const MapDisplay = ({ location }) => {
  return (
    <div className="mt-4">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={14}
        center={location || defaultCenter}
      >
        {location && <Marker position={location} />}
      </GoogleMap>
    </div>
  );
};

export default MapDisplay;
