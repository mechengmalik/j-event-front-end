import React, { useState, useCallback, useMemo } from "react";
import { useLocation } from "react-router-dom";
import searchIcon from "../../assets/icons/search-frame.svg";
import Navbar from "../../components/navbar";
import EventFilter from "../../components/event-filter";
import MapDisplay from "../../components/location-venue/map-frame";
import LocationForm from "../../components/location-venue";
import GoogleMapsProvider from "../../components/location-venue/googleMapProvider";
import LocationVenue from "./location-venue";
import homePage from "../../assets/icons/home-page-banner.svg";
import ksaCurrency from "../../assets/icons/ryal.svg";
import dateIcon from "../../assets/icons/b-calender.svg";
import timeIcon from "../../assets/icons/time.svg";

function EventsPage() {
  // Enhanced events array with categories as arrays and updated prices
  const eventsData = [
    {
      title: "Riyadh Food Festivallllllll lllllllll lllllll",
      price: "15.00",
      date: "2025-03-10",
      time: "18:30",
      location: "Riyadh",
      image: "event-image.png",
      id: 1,
      categories: ["Food & Drink", "Family & Education"],
    },
    {
      title: "Jeddah Music Nights",
      price: "30.00",
      date: "2025-04-05",
      time: "20:00",
      location: "Jeddah",
      image: "event-image.png",
      id: 2,
      categories: ["Fashion", "Food & Drink"],
    },
    {
      title: "Desert Arts Expo",
      price: "12.50",
      date: "2025-04-22",
      time: "17:00",
      location: "AlUla",
      image: "event-image.png",
      id: 3,
      categories: ["Fashion", "Family & Education"],
    },
    {
      title: "Khobar Comedy Show",
      price: "25.00",
      date: "2025-05-01",
      time: "21:00",
      location: "Khobar",
      image: "event-image.png",
      id: 4,
      categories: ["Family & Education"],
    },
    {
      title: "National Heritage Day",
      price: "0.00",
      date: "2025-05-15",
      time: "09:00",
      location: "Diriyah",
      image: "event-image.png",
      id: 5,
      categories: ["Family & Education", "Business"],
    },
    {
      title: "Future Tech Summit - NEOM",
      price: "99.00",
      date: "2025-06-03",
      time: "10:00",
      location: "NEOM",
      image: "event-image.png",
      id: 6,
      categories: ["Business", "Health"],
    },
    {
      title: "Madinah Poetry Evening",
      price: "10.00",
      date: "2025-06-14",
      time: "19:00",
      location: "Madinah",
      image: "event-image.png",
      id: 7,
      categories: ["Family & Education"],
    },
    {
      title: "Dammam Startup Pitch Night",
      price: "20.00",
      date: "2025-07-02",
      time: "16:00",
      location: "Dammam",
      image: "event-image.png",
      id: 8,
      categories: ["Business"],
    },
    {
      title: "Taif Summer Carnival",
      price: "5.00",
      date: "2025-07-20",
      time: "18:00",
      location: "Taif",
      image: "event-image.png",
      id: 9,
      categories: ["Family & Education", "Food & Drink"],
    },
    {
      title: "Jeddah Health and Wellness Expo",
      price: "8.00",
      date: "2025-05-15", // Today's date in the scenario
      time: "10:00",
      location: "Jeddah",
      image: "event-image.png",
      id: 10,
      categories: ["Health"],
    },
    {
      title: "Riyadh Business Networking",
      price: "0.00",
      date: "2025-05-16", // Tomorrow's date in the scenario
      time: "18:00",
      location: "Riyadh",
      image: "event-image.png",
      id: 11,
      categories: ["Business"],
    },
    {
      title: "Weekend Fashion Show",
      price: "50.00",
      date: "2025-05-17", // This weekend (Saturday) in the scenario
      time: "19:00",
      location: "Riyadh",
      image: "event-image.png",
      id: 12,
      categories: ["Fashion"],
    },
  ];

  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);

  // State to manage filtered events and search
  const [filteredEvents, setFilteredEvents] = useState(eventsData);
  const [searchTerm, setSearchTerm] = useState(queryParams.get("search"));

  const memoizedEventsData = useMemo(() => eventsData, []);

  // Search handler - only updates the search term
  const handleSearch = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  // Apply search filter to already filtered events
  const applySearchFilter = useCallback(
    (events) => {
      if (!searchTerm) return events;

      return events.filter(
        (event) =>
          event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    },
    [searchTerm]
  );

  // Event filter change handler
  const handleFilterChange = useCallback(
    (filtered) => {
      // Apply search filter after the main filtering is done
      const searchFiltered = applySearchFilter(filtered);
      setFilteredEvents(searchFiltered);
    },
    [applySearchFilter]
  );

  // Display the events with counts
  const displayedEvents = useMemo(() => {
    return filteredEvents;
  }, [filteredEvents]);

  return (
    <div>
      <div>
        <Navbar homePage={true} gradient={false} />
      </div>
      <div className="px-4 sm:px-6 md:px-20 lg:px-36 py-8 md:py-12 lg:py-16">
        <div className="events-search-bar pb-8">
          <div
            className="flex justify-center items-center bg-white text-right rounded-full w-full"
            style={{
              boxShadow: "0 0 16px rgba(0, 0, 0, 0.16)",
            }}
          >
            <input
              type="text"
              placeholder="Discover events tailored to your interests ..."
              className="w-full px-4 py-4 focus:outline-none text-[#8354A3] rounded-full"
              value={searchTerm}
              onChange={handleSearch}
            />
            <button className="search-btn">
              <img src={searchIcon} alt="search" className="px-2 py-2" />
            </button>
          </div>
        </div>

        <div className="filter-result pb-8  ">
          <div className="flex flex-col items-start">
            {searchTerm && (
              <p className="text-3xl font-bold text-[#8354A3] pb-4">
                “<span>{searchTerm}</span>”
              </p>
            )}

            <p className="font-normal">
              We’ve found <span>{filteredEvents.length}</span> results for you
            </p>
          </div>
        </div>

        {/* Event filter component with events data and filter change handler */}
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-1/3">
            <div className="overflow-none">
              <LocationVenue />
            </div>
            <EventFilter
              events={memoizedEventsData}
              onFilterChange={handleFilterChange}
            />
          </div>

          <div className="w-full lg:w-2/3">
            <div className="bg-white">
              {displayedEvents.length > 0 ? (
                <div className="space-y-4 pt-4">
                  {displayedEvents.map((event) => (
                    <div className="border border-black/20 rounded-lg flex flex-col sm:flex-row gap-4 h-auto sm:h-[176px]">
                      {/* Left image */}
                      <div className="w-full sm:max-w-3xs sm:flex-shrink-0 h-48 sm:h-full">
                        <img
                          className="event-img w-full h-full object-cover"
                          src={homePage}
                        />
                      </div>

                      {/* Right card body */}
                      <div className="card-body flex flex-col text-left justify-between flex-1 p-4">
                        <div className="card-title text-lg font-semibold">
                          {event.title}
                        </div>

                        <div className="event-price flex flex-row gap-2 items-center font-normal">
                          Start From{" "}
                          <span className="font-medium"> {event.price} </span>
                          <img src={ksaCurrency} alt="icon" />
                        </div>

                        <div className="event-date text-base font-normal">
                          <small className="text-body-secondary flex flex-row gap-2 items-center">
                            <img src={dateIcon} alt="icon" />
                            {event.date}
                          </small>
                        </div>

                        <div className="event-time text-base font-normal">
                          <small className="text-body-secondary flex flex-row gap-2 items-center">
                            <img src={timeIcon} alt="icon" />
                            {event.time}
                          </small>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">
                  No events match your filters. Try adjusting your criteria.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventsPage;
