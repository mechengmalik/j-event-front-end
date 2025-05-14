import React, { useState } from "react";
import { Link } from "react-router-dom";
import EventList from "../../../components/events-list";
import Breadcrumbs from "../../../components/breadcrumbs";
import plusIcon from "../../../assets/icons/plus-icon.svg";
import "./events.css";
const eventsFilter = [
  { id: 1, name: "All" },
  { id: 2, name: "Live" },
  { id: 3, name: "Draft" },
  { id: 4, name: "Trash" },
  { id: 5, name: "Canceled" },
];

function Events() {

  const [activeFilter, setActiveFilter] = useState(1);

  return (
    <div className="flex flex-col overflow-y-hidden justify-start px-6 sm:px-16 lg:px-12 ">
      <div className="flex flex-col justify-between">
        <div className="tickets-heading w-full flex justify-between items-center ">
          <div className="flex text-5xl font-bold justify-start items-center gap-4">
            
            Events
          </div>
          <div className="create-tickets-wrapper">
            <button className="create-tickets-btn flex gap-2 bg-regal-purple hover:bg-purple-500 text-white py-4 px-8">
              <img src={plusIcon} alt="plus icon" />
              <Link to={`../create-event`}>
                Create
              </Link>
            </button>
          </div>
        </div>

        <div className="text-base flex items-center">
          <Breadcrumbs />
        </div>
      </div>

      <div className="events-list-wrapper w-full">
        <div className="events-list flex w-full pt-12 shadow-2xs text-regal-black">
          {eventsFilter.map((item) => (
            <div key={item.id} className="events-filters ">
              <button
                onClick={() => setActiveFilter(item.id)}
                className={`non-rounded text-sm px-4 py-3  transition-colors duration-200 ${
                  activeFilter === item.id
                    ? "bg-purple-100 rounded-none text-regal-purple font-semibold"
                    : "text-gray-600 hover:text-regal-purple"
                }`}
              >
                {item.name}
              </button>
            </div>
          ))}
        </div>

        <div className="events-cards w-full overflow-x-hidden pt-6 ">
          <EventList activeFilter={activeFilter} />
        </div>
      </div>
    </div>
  );
}

export default Events;
