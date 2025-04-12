import React from "react";
import Dashboard from "../index";
import Navbar from "../../../components/navbar";
import EventList from "../../../components/events-list";

const eventsFilter = [
  {
    id: 1,
    name: "All",
  },
  {
    id: 2,
    name: "Live",
  },
  {
    id: 3,
    name: "Draft",
  },
  {
    id: 4,
    name: "Trash",
  },
  {
    id: 5,
    name: "Canceled",
  },
];

function Events() {
  return (
    <Dashboard>
      <div className="events-container">
        <div className="events-wrapper flex flex-col gap-1 items-start m-6 pt-6 ">
          <div className="events-heading w-full flex justify-between items-center ">
            <div className="events-title-wrapper">
              <h2 className="events-title text-4xl font-bold">Events</h2>
            </div>
            <div className="create-events-wrapper pt-2">
              <button class="create-events-btn bg-regal-purple hover:bg-purple-500 text-white py-2 px-4 rounded">
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
            <div className="events-list flex w-full gap-11 mt-5 shadow-2xs text-regal-black">
              {eventsFilter.map((item) => (
                <div className="events-filters ">
                  <button className="menu-name text-sm">{item.name}</button>
                </div>
              ))}
            </div>

            <div className="events-cards w-full overflow-x-hidden mt-5 ">
              <EventList />
            </div>
          </div>
        </div>
      </div>
    </Dashboard>
  );
}

export default Events;
