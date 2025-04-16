import React, { useState, useEffect, useRef } from "react";
import "./events-list.css";
import eventDefaultImage from "../../assets/icons/default-logo.svg";
import calender from "../../assets/icons/calender.svg";
import table from "../../assets/icons/table.svg";
import threeDotsIcon from "../../assets/icons/threedots.svg";
import exclamationMarkView from "../../assets/icons/exclamation-mark-overview.svg";
import editIcon from "../../assets/icons/edit-icon.svg";
import copyIcon from "../../assets/icons/copy-icon.svg";
import trashIcon from "../../assets/icons/trash.svg";

function EventCard({ event }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="card-container relative flex flex-col shadow-sm border border-slate-200  my-4 w-full max-w-sm">
      {event.status === "live" && (
        <div className="absolute top-3 left-2 bg-regal-purple text-white text-xs font-semibold px-2 py-1 z-20">
          LIVE
        </div>
      )}

      {/* 3-dot menu button */}
      <div className="absolute top-2 right-2 z-20" ref={menuRef}>
        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          className="text-gray-700 hover:text-black text-lg font-bold p-2"
        >
          <img src={threeDotsIcon} alt="menu" />
        </button>

        {menuOpen && (
          <div className=" event-menu absolute right-0 mt-2 w-40 bg-white border  shadow-md z-50 text-sm">
            <div className="overview-option">
              <button className="overview-button w-full flex gap-2 px-4 py-2 hover:bg-black/10">
                <img
                  className="overview-icon"
                  src={exclamationMarkView}
                  alt="over view"
                />
                Overview
              </button>
            </div>
            <div className="manage-option">
              <button className="manage-button w-full flex gap-2 px-4 py-2 hover:bg-black/10">
                <img className="manage-icon" src={editIcon} alt="manage" />
                Manage
              </button>
            </div>
            <div className="clone-option">
              <button className="clone-button w-full text-xs flex gap-2 px-4 py-2 hover:bg-black/10">
                <img className="copy-icon-icon" src={copyIcon} alt="copy" />
                Clone
              </button>
            </div>
            <div className="delete-option">
              <button className="block w-full flex gap-3 text-left px-4 py-2 text-red-600 hover:bg-black/10">
                <img className="trash-icon" src={trashIcon} alt="trash-icon" />
                Move to trash
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="event-img-container bg-regal-blue overflow-hidden -t-md h-56 flex justify-center items-center relative">
        <img
          className="event-image object-cover bg-regal-blue"
          src={eventDefaultImage}
          alt="event-img"
        />

        {event.status === "live" && (
          <div className="absolute bottom-0 left-0 right-0 bg-regal-purple text-white text-center text-xs  py-1">
            Remaining 325 Seats
          </div>
        )}
        {event.status === "live" && event.availableSeat == 0 && (
          <div className="absolute bottom-0 left-0 right-0 bg-regal-red text-white text-center text-xs py-1">
            All Seats Are Sold Out
          </div>
        )}
      </div>

      <div className="card-footer flex flex-col gap-3 p-3 text-start">
        <h4 className="event-name mb-1 text-base font-semibold text-slate-800">
          {event.name}
        </h4>

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

        <div className="text-xs text-regal-black font-light">
          Last modified 2 days ago
        </div>
      </div>
    </div>
  );
}

export default EventCard;
