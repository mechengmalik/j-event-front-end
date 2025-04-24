import React from "react";
import { useNavigate } from "react-router-dom";
import backArrow from "../../../../assets/icons/back-arrow.svg";
import Breadcrumbs from "../../../../components/breadcrumbs";
import eventMarker from "../../../../assets/icons/event-marker.svg";
import eventType from "../../../../assets/icons/event-location-type.svg";
import calender from "../../../../assets/icons/calender.svg";
import homeoage from "../../../../assets/icons/home-page-banner.svg";
import seatIcon from "../../../../assets/icons/seat-icon.svg";
import starIcon from "../../../../assets/icons/star-icon.svg";
import editIcon from "../../../../assets/icons/edit-icon.svg";
import previewIcon from "../../../../assets/icons/preview.svg";

function EventDetails() {
  const navigate = useNavigate();

  const handleViewSeatMap = () => {
    navigate(`../events/seating-map`);
    // navigate(`/events/seating-map/${eventId}`);
  };

  return (
    <div className="flex flex-col overflow-y-hidden justify-start px-4 sm:px-6 lg:px-12">
      <div className="flex flex-col justify-between">
        {/* Header + Breadcrumb */}
        <div className="flex flex-wrap text-2xl sm:text-3xl font-bold justify-start items-center gap-4 p-4 pl-5">
          <button onClick={() => navigate(-1)}>
            <img
              src={backArrow}
              alt="Back"
              className="w-6 h-6 sm:w-auto sm:h-auto"
            />
          </button>
          Event Details
        </div>

        <Breadcrumbs />
        <hr className="flex-grow border-t border-black/10 pb-6" />

        {/* Event Card */}
        <div className="event-card">
          {/* Cover image */}
          <div
            className="event-image h-[28rem] sm:h-[35rem] w-full bg-cover bg-center"
            style={{ backgroundImage: `url(${homeoage})` }}
          >
            <div className="flex flex-col justify-between h-full px-4 sm:px-8 py-6 sm:py-8">
              {/* Actions */}
              <div className="flex flex-col sm:flex-row w-full justify-between gap-4">
                <img
                  src={previewIcon}
                  alt="preview icon"
                  className="w-6 h-6 sm:w-auto sm:h-auto"
                />
                <div className="flex flex-col sm:flex-row justify-end gap-4 text-white w-full sm:w-auto">
                  <button className="border border-white px-4 py-2 text-base sm:h-[56px] w-full sm:w-[202px]">
                    <span className="flex justify-center items-center gap-2">
                      <img
                        src={editIcon}
                        alt="edit"
                        className="invert w-4 h-4"
                      />
                      Edit Event
                    </span>
                  </button>
                  <button
                    onClick={handleViewSeatMap}
                    className="border border-white px-4 py-2 text-base sm:h-[56px] w-full sm:w-[202px]"
                  >
                    <span className="flex justify-center items-center gap-2">
                      <img src={seatIcon} alt="seat" className="w-4 h-4" />
                      View Seat Map
                    </span>
                  </button>
                  <button className="border border-white px-4 py-2 text-base sm:h-[56px] w-full sm:w-[202px]">
                    <span className="flex justify-center items-center gap-2">
                      <img src={starIcon} alt="star" className="w-4 h-4" />
                      View Tickets
                    </span>
                  </button>
                </div>
              </div>

              {/* Event Info */}
              <div className="flex flex-col justify-between items-start mt-6">
                <h2 className="text-2xl sm:text-3xl font-bold text-white p-2">
                  Saudi Founding Day
                </h2>
                <div className="flex flex-wrap items-center text-sm sm:text-base font-light text-white gap-4 p-2">
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
                <div className="flex flex-wrap gap-2 text-xs text-white/80 p-2">
                  <span>Culture</span>
                  <span>Heritage</span>
                  <span>History</span>
                  <span>Festival</span>
                  <span>Traditions</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="event-card-footer flex flex-col justify-between pt-8 text-[#444] leading-6 text-left px-2 sm:px-0">
            <p className="text-lg sm:text-xl font-bold text-[#8354A3]">
              Description
            </p>
            <p className="text-sm sm:text-base font-light text-[#333333] pt-4">
              Join us as we celebrate Saudi Founding Day, a special occasion
              that honors the rich history, culture, and heritage of the Kingdom
              of Saudi Arabia. This national event commemorates the founding of
              the first Saudi state by Imam Muhammad bin Saud in 1727... (and so
              on)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventDetails;
