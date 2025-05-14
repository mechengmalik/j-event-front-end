import React, { useState } from "react";
import "./ticket-list.css";
import threeDotsIcon from "../../assets/icons/threedots.svg";
import exclamationMarkView from "../../assets/icons/exclamation-mark-overview.svg";
import editIcon from "../../assets/icons/edit-icon.svg";
import trashIcon from "../../assets/icons/trash.svg";
import ticketDefaultIcon from "../../assets/icons/ticket-image.svg";
import checkMark from "../../assets/icons/check-mark-v2.svg";

function TicketCard({ ticket, onManage, onOverview, onDelete }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showAllBenefits, setShowAllBenefits] = useState(false);

  const benefitsToShow = showAllBenefits ? ticket?.benefits : ticket?.benefits?.slice(0, 2);

  return (
    <div className="card-container relative flex flex-col shadow-sm border border-slate-200   my-4 w-full max-w-sm">
      {/* 3-dot menu button */}
      <div className="absolute top-2 right-2 z-20">
        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          className="text-gray-700 hover:text-black text-lg font-bold p-2"
        >
          <img src={threeDotsIcon} alt="menu" />
        </button>

        {menuOpen && (
          <div className=" event-menu absolute right-0 mt-2 w-40 bg-white border shadow-md z-50 text-sm">
            <div className="overview-option">
              <button
                onClick={() => onOverview(ticket.id)}
                className="overview-button w-full flex gap-2 px-4 py-2 hover:bg-black/10"
              >
                <img
                  className="overview-icon"
                  src={exclamationMarkView}
                  alt="over view"
                />
                Overview
              </button>
            </div>
            <div className="manage-option">
              <button
                onClick={() => onManage(ticket.id)}
                className="manage-button w-full flex gap-2 px-4 py-2 hover:bg-black/10"
              >
                <img className="manage-icon" src={editIcon} alt="manage" />
                Manage
              </button>
            </div>
            <div className="delete-option">
              <button
                onClick={() => onDelete(ticket.id)}
                className="block w-full flex gap-3 text-left px-4 py-2 text-red-600 hover:bg-black/10"
              >
                <img className="trash-icon" src={trashIcon} alt="trash-icon" />
                Move to trash
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="ticket-img-container bg-regal-blue overflow-hidden -t-md h-56 flex justify-center items-center relative">
        <img
          className="ticket-image object-cover bg-regal-blue"
          src={ticketDefaultIcon}
          alt="ticket-img"
        />

        {ticket?.seats >= 0 && (
          <div className="absolute bottom-0 left-0 right-0 bg-regal-purple text-white text-center text-xs   py-1">
            {ticket.seats} Seats
          </div>
        )}
        {ticket?.status === "live" && ticket?.availableSeat == 0 && (
          <div className="absolute bottom-0 left-0 right-0 bg-regal-red text-white text-center text-xs py-1">
            All Seats Are Sold Out
          </div>
        )}
      </div>

      <div className="card-footer flex flex-col p-4 text-start">
        <div className="flex justify-between">
          <p className="ticket-name pb-4 text-base font-semibold text-slate-800">
            {ticket?.name}
          </p>
          <p className="ticket-price text-base font-normal text-slate-800">
            {ticket?.price}{ticket?.currency}
          </p>
        </div>

        <span className="border-line border-line-black/20"></span>

        {benefitsToShow && benefitsToShow.length > 0 && (
          <div className="pt-4">
            {benefitsToShow.map((benefit, index) => (
              <div key={index} className="flex items-center gap-2 pb-2 text-sm text-regal-black">
                <img src={checkMark} alt="" />
                {benefit}
              </div>
            ))}

            {!showAllBenefits && ticket?.benefits?.length > 2 && (
              <button
                onClick={() => setShowAllBenefits(true)}
                className="text-sm text-[#333333] font-normal cursor-pointer"
              >
                +{ticket.benefits.length - 2} more
              </button>
            )}

            {showAllBenefits && ticket?.benefits?.length > 2 && (
              <button
                onClick={() => setShowAllBenefits(false)}
                className="text-sm text-[#333333] font-normal cursor-pointer"
              >
                Show less
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default TicketCard;