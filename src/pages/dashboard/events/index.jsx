import React, { useState } from "react";
import Dashboard from "../index";
import EventList from "../../../components/events-list";

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
    <Dashboard>
      <div className="events-container">
        <div className="events-wrapper flex flex-col gap-1 items-start m-6 pt-6 ">
          <div className="events-heading w-full flex justify-between items-center ">
            <div className="events-title-wrapper">
              <h2 className="events-title text-4xl font-bold">Events</h2>
            </div>
            <div className="create-events-wrapper pt-2">
              <button className="create-events-btn bg-regal-purple hover:bg-purple-500 text-white py-2 px-4 rounded">
                + Create Event
              </button>
            </div>
          </div>

          <div className="events-description text-left text-regal-black mb-4">
            <h5>
              Create, edit, and organize events seamlessly to deliver the best
              experiences
            </h5>
          </div>

          <div className="events-list-wrapper w-full">
            <div className="events-list flex w-full gap-4 mt-5 shadow-2xs text-regal-black">
              {eventsFilter.map((item) => (
                <div key={item.id} className="events-filters">
                  <button
                    onClick={() => setActiveFilter(item.id)}
                    className={`non-rounded text-sm px-4 py-2  transition-colors duration-200 ${
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

            <div className="events-cards w-full overflow-x-hidden mt-5 ">
              <EventList activeFilter={activeFilter} />
            </div>
          </div>
        </div>
      </div>
    </Dashboard>
  );
}

export default Events;
