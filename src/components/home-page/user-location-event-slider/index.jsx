import React, { useState } from "react";
import homePage from "../../../assets/icons/home-page-banner.svg";
import dateIcon from "../../../assets/icons/date-white-icon.svg";
import timeIcon from "../../../assets/icons/time-white-icon.svg";
import ksaCurrency from "../../../assets/icons/ksa-currency.svg";
import bookmark from "../../../assets/icons/bookmark.svg";
import "./user-location-event-slider.css";
const eventsData = [
  {
    title:
      "فعالية 1fffffffffffffffffffffff ffffffffffffffff  fffffffff ffff ffffffffff ffffffffffffff",
    price: "9.99",
    date: "24/2/2025",
    time: "06:00",
    image: "event-image.png",
    id: 1,
  },
  {
    title:
      "فعالية 2gggggg ggggggggggg ggggggggg ggggggggggg gggggggg gggggggggg ggggggg",
    price: "9.99",
    date: "24/2/2025",
    time: "06:00",
    image: "event-image.png",
    id: 2,
  },
  {
    title: "فعالية 3",
    price: "9.99",
    date: "24/2/2025",
    time: "06:00",
    image: "event-image.png",
    id: 3,
  },
  {
    title: "فعالية 4",
    price: "9.99",
    date: "24/2/2025",
    time: "06:00",
    image: "event-image.png",
    id: 4,
  },
  {
    title: "فعالية 5",
    price: "9.99",
    date: "24/2/2025",
    time: "06:00",
    image: "event-image.png",
    id: 5,
  },
  {
    title: "فعالية 6",
    price: "9.99",
    date: "24/2/2025",
    time: "06:00",
    image: "event-image.png",
    id: 6,
  },
  {
    title: "فعالية 7",
    price: "9.99",
    date: "24/2/2025",
    time: "06:00",
    image: "event-image.png",
    id: 7,
  },
  {
    title: "فعالية 8",
    price: "9.99",
    date: "24/2/2025",
    time: "06:00",
    image: "event-image.png",
    id: 8,
  },
  {
    title: "فعالية 9",
    price: "9.99",
    date: "24/2/2025",
    time: "06:00",
    image: "event-image.png",
    id: 9,
  },
];

const LocationEvents = () => {
  const [filters, setFilters] = useState({
    date: "",
    category: "",
    location: "",
  });

  const filteredEvents = eventsData.filter(
    (event) =>
      (!filters.date || event.date === filters.date) &&
      (!filters.location || event.location === filters.location)
  );

  return (
    <div className="w-full flex justify-center bg-gradient-to-b from-[#1D052E] to-[#8354A3] border rounded-xl ">
      <div className="w-full px-12 py-10">
        {/* Filters */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex gap-2 text-white items-start">
            <img src={bookmark} alt="bookmark" className="pt-2" />
            <div>
              <span className="text-lg">Events</span>
              <div className="text-3xl font-bold">Today</div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 text-black w-full md:w-auto">
            <div className="w-[164px] bg-white px-2">
              <select
                className="pr-7 py-2 bg-white w-full sm:w-auto"
                value={filters.date}
                onChange={(e) =>
                  setFilters({ ...filters, date: e.target.value })
                }
              >
                <option value="">Date</option>
                {/* Additional dates */}
              </select>
            </div>

            <div className="w-[164px] bg-white px-2">
              <select
                className="pr-7 py-2 bg-white w-full sm:w-auto"
                value={filters.category}
                onChange={(e) =>
                  setFilters({ ...filters, category: e.target.value })
                }
              >
                <option value="">Category</option>
              </select>
            </div>
            <div className="w-[164px] bg-white px-2">
              <select
                className=" pr-7 py-2 bg-white w-full sm:w-auto"
                value={filters.location}
                onChange={(e) =>
                  setFilters({ ...filters, location: e.target.value })
                }
              >
                <option value="">Location</option>
              </select>
            </div>
          </div>
        </div>
        <div className="border w-full border-white my-8"></div>
        {/* Scrollable Event Grid */}
        <div className="event-list-wrapper overflow-x-auto custom-scrollbar">
          <div className="list-column flex gap-16">
            {Array.from({ length: Math.ceil(filteredEvents.length / 3) }).map(
              (_, columnIndex) => (
                <div key={columnIndex} className="column flex flex-col gap-4">
                  {filteredEvents
                    .slice(columnIndex * 3, columnIndex * 3 + 3)
                    .map((event) => (
                      <div key={event.id} className="event-card w-144 py-8">
                        <div className="w-full flex gap-6">
                          <div className="col max-w-3xs">
                            <img className="event-img" src={homePage} />
                          </div>
                          <div>
                            <div className="card-body max-w-3xs text-left text-white flex flex-col justify-between items-start h-full">
                              <div className="card-title">{event.title}</div>
                              <div className="event-price  w-full flex flex-row gap-2 items-center text-sm">
                                Start From {event.price}
                                <img src={ksaCurrency} alt="icon" />
                              </div>
                              <div className="event-date  w-full text-sm">
                                <small className="text-body-secondary flex flex-row gap-2 items-center">
                                  <img src={dateIcon} alt="icon" />
                                  {event.date}
                                </small>
                              </div>
                              <div className="event-time w-full text-sm">
                                <small className="text-body-secondary flex flex-row gap-2 items-center">
                                  <img src={timeIcon} alt="icon" />
                                  {event.time}
                                </small>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationEvents;
