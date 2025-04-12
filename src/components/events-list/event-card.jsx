import React from "react";
import "./events-list.css";
import eventDefaultImage from "../../assets/icons/default-logo.svg";
import calender from "../../assets/icons/calender.svg";
import table from "../../assets/icons/table.svg";

function EventCard({event}) {
  return (
    <div className="card-container flex flex-col shadow-sm border border-slate-200 rounded-lg my-4 w-full max-w-sm">
      <div className="event-img-container bg-regal-blue overflow-hidden rounded-t-md h-56 flex justify-center items-center">
        <img
          className="event-image object-cover bg-regal-blue"
          src={eventDefaultImage}
          alt="event-img"
        />
      </div>
      <div className="card-footer flex flex-col gap-3 p-3 text-start">
        <h4 className="event-name mb-1 text-lg font-semibold text-slate-800">{event.name}</h4>
        {/* <h4
  className="event-name mb-1 font-semibold text-slate-800 truncate text-[clamp(0.875rem,1.8vw,1rem)]"
  title={event.name} 
>
  {event.name}
</h4> */}
        <p className="event-calender flex items-center gap-2 text-sm font-light tracking-wider text-regal-black">
          <img className="calender-icon" src={calender} alt="calendar" />
          {event.date}
        </p>
        <p className="event-tables flex items-center gap-2 text-sm font-light tracking-wider text-regal-black pb-2">
          <img className="table-icon" src={table} alt="table" />
          {event.table} tables
        </p>
        <span className="border-line"></span>
        <p className="event-description text-sm text-regal-black pt-2">
          {event.description}
        </p>
        <div className="text-xs text-regal-black font-light">Last modified 2 days ago</div>
      </div>
    </div>
  );
}

export default EventCard;
