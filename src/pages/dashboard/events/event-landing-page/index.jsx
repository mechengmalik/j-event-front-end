import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../../../components/navbar";
import Breadcrumbs from "../../../../components/breadcrumbs";
import eventMarker from "../../../../assets/icons/event-marker.svg";
import eventType from "../../../../assets/icons/event-location-type.svg";
import calender from "../../../../assets/icons/calender.svg";
import homeoage from "../../../../assets/icons/home-page-banner.svg";
import MapDisplay from "../../../../components/location-venue/map-frame";
import EventCards from "../../../../components/home-page/events-cards";
import purpleRect from "../../../../assets/icons/purple-rect.svg";
import whiteRect from "../../../../assets/icons/rectangle-white.svg";
import ryalIcon from "../../../../assets/icons/ryal.svg";
import GoogleMapsProvider from "../../../../components/location-venue/googleMapProvider";

function EventLandingPage() {
  // Instead of just a string, we'll use an object with coordinates
  const [location, setLocation] = useState({
    
    address: "Jabal Al Lweibdeh, Amman, Jordan",
    lat: 31.9558443,
    lng: 35.9279374,
    name: "Jabal Al Lweibdeh",
    placeId: "ChIJK-prBnagHBURsrLgOE5pl98",
  });
  // const { isLoaded } = useLoadScript({
  //   googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  // });

  return (
    <div>
      <Navbar homePage={true} gradient={false} />

      <div className="flex flex-col overflow-y-hidden justify-start">
        <div className="flex flex-col justify-between">
          {/* Event Card */}
          <div className="relative h-[28rem] sm:h-[35rem] w-full">
            {/* Image as background */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${homeoage})` }}
            ></div>

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent">
              <div className="flex flex-col justify-between h-full px-30 sm:px-30 py-6 sm:py-8 justify-end">
                {/* Event Info */}
                <div className="flex flex-col justify-between items-start mt-6">
                  <h2 className="text-2xl sm:text-3xl font-bold text-white py-2">
                    Saudi Founding Day
                  </h2>
                  <div className="flex flex-wrap items-center text-sm sm:text-base font-light text-white gap-4 py-2">
                    <span className="flex gap-2 items-center">
                      <img src={calender} alt="" className="w-4 h-4" />
                      13 Feb - 14 Feb
                    </span>
                    <span className="flex gap-2 items-center">
                      <img src={eventType} alt="" className="w-4 h-4" />
                      In-person
                    </span>
                    <span className="flex gap-2 items-center">
                      <img src={eventMarker} alt="" className="w-4 h-4" />
                      Riyadh
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs text-white/80 py-2">
                    <span>Culture</span>
                    <span>Heritage</span>
                    <span>History</span>
                    <span>Festival</span>
                    <span>Traditions</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute bg-white top-105 right-20 max-w-[364px] w-full">
              {/* Scalloped Edge */}
              <div className="flex w-full">
                <img width="52px" src={whiteRect} alt="whiteRect" />
                <img width="52px" src={purpleRect} alt="purpleRect" />
                <img width="52px" src={whiteRect} alt="whiteRect" />
                <img width="52px" src={purpleRect} alt="purpleRect" />
                <img width="52px" src={whiteRect} alt="whiteRect" />
                <img width="52px" src={purpleRect} alt="purpleRect" />
                <img width="52px" src={whiteRect} alt="whiteRect" />
              </div>

              {/* Ticket Content */}
              <div className="bg-white p-8 rounded-b-3xl shadow-[0_20px_40px_rgba(0,0,0,0.1)]">
                {/* Ticket Header */}
                <div className="pb-8">
                  <h2 className="text-2xl font-bold text-left">Tickets</h2>
                  <p className="text-left text-[#333333]">
                    Starting from 9.99{" "}
                    <img src={ryalIcon} alt="Ryal" className="inline h-4 w-4" />
                  </p>
                </div>

                {/* Button */}
                <button className="w-full py-4 bg-[#8354A3] text-white font-medium rounded-md">
                  Book Now
                </button>
              </div>
            </div>
          </div>
          <div className="event-card">
            <div className="pl-30 pr-19">
              <div className="event-card-footer flex flex-col justify-between pt-12 pr-140 leading-6 text-left">
                <p className="text-xl sm:text-lg font-bold ">Description</p>
                <p className="text-base  font-normal pt-2">
                  Join us as we celebrate Saudi Founding Day, a special occasion
                  that honors the rich history, culture, and heritage of the
                  Kingdom of Saudi Arabia. This national event commemorates the
                  founding of the first Saudi state by Imam Muhammad bin Saud in
                  1727... (and so on)
                </p>
              </div>

              <div className="event-card-footer flex flex-col justify-between pt-22 leading-6 text-left px-2 sm:px-0">
                <div className="text-lg sm:text-xl font-bold text-[#8354A3]">
                  {location && (
                    <button
                      onClick={() => {
                        const navigationUrl = `https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.lng}`;
                        window.open(navigationUrl, "_blank");
                      }}
                      className=" bg-white text-base text-[#8354A3] py-4 px-8 border rounded-md hover:bg-[#6a4182] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#8354A3] focus:ring-opacity-50"
                    >
                      Get Directions
                    </button>
                  )}
                </div>
                <div className="pt-4">
                  <GoogleMapsProvider>
                    <MapDisplay location={location} className="w-full" />
                  </GoogleMapsProvider>
                </div>
              </div>

              <div className="event-card-footer flex flex-col justify-between pt-22 leading-6 text-left px-2 sm:px-0">
                <p className="text-3xl sm:text-xl font-bold ">FAQs</p>
                <p className="text-sm sm:text-base font-light  pt-8">
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the industry's
                  standard dummy text ever since the 1500s, when an unknown
                  printer took a galley of type and scrambled it to make a type
                  specimen book...
                </p>
              </div>
              <div className="event-card-footer  flex flex-col justify-between pt-22 leading-6 text-left px-2 sm:px-0">
                <p className="text-3xl sm:text-xl font-bold ">
                  Terms and conditions
                </p>
                <p className="text-sm sm:text-base font-light pt-8">
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the industry's
                  standard dummy text ever since the 1500s, when an unknown
                  printer took a galley of type and scrambled it to make a type
                  specimen book...
                </p>
              </div>

              <div className="event-card-footer  flex flex-col justify-between pt-22 leading-6 text-left px-2 sm:px-0">
                <p className="text-3xl sm:text-xl font-bold ">Recommended </p>
                <p className="text-sm sm:text-base font-light pt-8">
                  <EventCards />
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventLandingPage;
